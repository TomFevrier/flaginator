
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if (typeof $$scope.dirty === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let stylesheet;
    let active = 0;
    let current_rules = {};
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        if (!current_rules[name]) {
            if (!stylesheet) {
                const style = element('style');
                document.head.appendChild(style);
                stylesheet = style.sheet;
            }
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        node.style.animation = (node.style.animation || '')
            .split(', ')
            .filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        )
            .join(', ');
        if (name && !--active)
            clear_rules();
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            let i = stylesheet.cssRules.length;
            while (i--)
                stylesheet.deleteRule(i);
            current_rules = {};
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined' ? window : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.17.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    var EOL = {},
        EOF = {},
        QUOTE = 34,
        NEWLINE = 10,
        RETURN = 13;

    function objectConverter(columns) {
      return new Function("d", "return {" + columns.map(function(name, i) {
        return JSON.stringify(name) + ": d[" + i + "] || \"\"";
      }).join(",") + "}");
    }

    function customConverter(columns, f) {
      var object = objectConverter(columns);
      return function(row, i) {
        return f(object(row), i, columns);
      };
    }

    // Compute unique columns in order of discovery.
    function inferColumns(rows) {
      var columnSet = Object.create(null),
          columns = [];

      rows.forEach(function(row) {
        for (var column in row) {
          if (!(column in columnSet)) {
            columns.push(columnSet[column] = column);
          }
        }
      });

      return columns;
    }

    function pad(value, width) {
      var s = value + "", length = s.length;
      return length < width ? new Array(width - length + 1).join(0) + s : s;
    }

    function formatYear(year) {
      return year < 0 ? "-" + pad(-year, 6)
        : year > 9999 ? "+" + pad(year, 6)
        : pad(year, 4);
    }

    function formatDate(date) {
      var hours = date.getUTCHours(),
          minutes = date.getUTCMinutes(),
          seconds = date.getUTCSeconds(),
          milliseconds = date.getUTCMilliseconds();
      return isNaN(date) ? "Invalid Date"
          : formatYear(date.getUTCFullYear()) + "-" + pad(date.getUTCMonth() + 1, 2) + "-" + pad(date.getUTCDate(), 2)
          + (milliseconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(milliseconds, 3) + "Z"
          : seconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "Z"
          : minutes || hours ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + "Z"
          : "");
    }

    function dsvFormat(delimiter) {
      var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
          DELIMITER = delimiter.charCodeAt(0);

      function parse(text, f) {
        var convert, columns, rows = parseRows(text, function(row, i) {
          if (convert) return convert(row, i - 1);
          columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
        });
        rows.columns = columns || [];
        return rows;
      }

      function parseRows(text, f) {
        var rows = [], // output rows
            N = text.length,
            I = 0, // current character index
            n = 0, // current line number
            t, // current token
            eof = N <= 0, // current token followed by EOF?
            eol = false; // current token followed by EOL?

        // Strip the trailing newline.
        if (text.charCodeAt(N - 1) === NEWLINE) --N;
        if (text.charCodeAt(N - 1) === RETURN) --N;

        function token() {
          if (eof) return EOF;
          if (eol) return eol = false, EOL;

          // Unescape quotes.
          var i, j = I, c;
          if (text.charCodeAt(j) === QUOTE) {
            while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);
            if ((i = I) >= N) eof = true;
            else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;
            else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
            return text.slice(j + 1, i - 1).replace(/""/g, "\"");
          }

          // Find next delimiter or newline.
          while (I < N) {
            if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;
            else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
            else if (c !== DELIMITER) continue;
            return text.slice(j, i);
          }

          // Return last token before EOF.
          return eof = true, text.slice(j, N);
        }

        while ((t = token()) !== EOF) {
          var row = [];
          while (t !== EOL && t !== EOF) row.push(t), t = token();
          if (f && (row = f(row, n++)) == null) continue;
          rows.push(row);
        }

        return rows;
      }

      function preformatBody(rows, columns) {
        return rows.map(function(row) {
          return columns.map(function(column) {
            return formatValue(row[column]);
          }).join(delimiter);
        });
      }

      function format(rows, columns) {
        if (columns == null) columns = inferColumns(rows);
        return [columns.map(formatValue).join(delimiter)].concat(preformatBody(rows, columns)).join("\n");
      }

      function formatBody(rows, columns) {
        if (columns == null) columns = inferColumns(rows);
        return preformatBody(rows, columns).join("\n");
      }

      function formatRows(rows) {
        return rows.map(formatRow).join("\n");
      }

      function formatRow(row) {
        return row.map(formatValue).join(delimiter);
      }

      function formatValue(value) {
        return value == null ? ""
            : value instanceof Date ? formatDate(value)
            : reFormat.test(value += "") ? "\"" + value.replace(/"/g, "\"\"") + "\""
            : value;
      }

      return {
        parse: parse,
        parseRows: parseRows,
        format: format,
        formatBody: formatBody,
        formatRows: formatRows,
        formatRow: formatRow,
        formatValue: formatValue
      };
    }

    var csv = dsvFormat(",");

    var csvParse = csv.parse;

    function responseText(response) {
      if (!response.ok) throw new Error(response.status + " " + response.statusText);
      return response.text();
    }

    function text$1(input, init) {
      return fetch(input, init).then(responseText);
    }

    function dsvParse(parse) {
      return function(input, init, row) {
        if (arguments.length === 2 && typeof init === "function") row = init, init = undefined;
        return text$1(input, init).then(function(response) {
          return parse(response, row);
        });
      };
    }

    var csv$1 = dsvParse(csvParse);

    /* src/Background.svelte generated by Svelte v3.17.2 */

    const file = "src/Background.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    function get_each_context_6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (13:4) {#each flags.slice(0, NB_FLAGS) as flag}
    function create_each_block_6(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "assets/flags/" + /*flag*/ ctx[4].code.toLowerCase() + ".png")) attr_dev(img, "src", img_src_value);
    			set_style(img, "width", "calc(200vw / " + NB_FLAGS + ")");
    			attr_dev(img, "class", "svelte-19j8i1r");
    			add_location(img, file, 13, 5, 235);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*flags*/ 1 && img.src !== (img_src_value = "assets/flags/" + /*flag*/ ctx[4].code.toLowerCase() + ".png")) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_6.name,
    		type: "each",
    		source: "(13:4) {#each flags.slice(0, NB_FLAGS) as flag}",
    		ctx
    	});

    	return block;
    }

    // (19:4) {#each flags.slice(0, NB_FLAGS * 0.5) as flag}
    function create_each_block_5(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "assets/flags/" + /*flag*/ ctx[4].code.toLowerCase() + ".png")) attr_dev(img, "src", img_src_value);
    			set_style(img, "width", "calc(200vw / " + NB_FLAGS + ")");
    			attr_dev(img, "class", "svelte-19j8i1r");
    			add_location(img, file, 19, 5, 418);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*flags*/ 1 && img.src !== (img_src_value = "assets/flags/" + /*flag*/ ctx[4].code.toLowerCase() + ".png")) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(19:4) {#each flags.slice(0, NB_FLAGS * 0.5) as flag}",
    		ctx
    	});

    	return block;
    }

    // (27:4) {#each flags.slice(NB_FLAGS, NB_FLAGS * 2) as flag}
    function create_each_block_4(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "assets/flags/" + /*flag*/ ctx[4].code.toLowerCase() + ".png")) attr_dev(img, "src", img_src_value);
    			set_style(img, "width", "calc(200vw / " + NB_FLAGS + ")");
    			attr_dev(img, "class", "svelte-19j8i1r");
    			add_location(img, file, 27, 5, 637);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*flags*/ 1 && img.src !== (img_src_value = "assets/flags/" + /*flag*/ ctx[4].code.toLowerCase() + ".png")) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(27:4) {#each flags.slice(NB_FLAGS, NB_FLAGS * 2) as flag}",
    		ctx
    	});

    	return block;
    }

    // (33:4) {#each flags.slice(NB_FLAGS, NB_FLAGS * 1.5) as flag}
    function create_each_block_3(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "assets/flags/" + /*flag*/ ctx[4].code.toLowerCase() + ".png")) attr_dev(img, "src", img_src_value);
    			set_style(img, "width", "calc(200vw / " + NB_FLAGS + ")");
    			attr_dev(img, "class", "svelte-19j8i1r");
    			add_location(img, file, 33, 5, 827);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*flags*/ 1 && img.src !== (img_src_value = "assets/flags/" + /*flag*/ ctx[4].code.toLowerCase() + ".png")) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(33:4) {#each flags.slice(NB_FLAGS, NB_FLAGS * 1.5) as flag}",
    		ctx
    	});

    	return block;
    }

    // (41:4) {#each flags.slice(NB_FLAGS * 2, NB_FLAGS * 3) as flag}
    function create_each_block_2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "assets/flags/" + /*flag*/ ctx[4].code.toLowerCase() + ".png")) attr_dev(img, "src", img_src_value);
    			set_style(img, "width", "calc(200vw / " + NB_FLAGS + ")");
    			attr_dev(img, "class", "svelte-19j8i1r");
    			add_location(img, file, 41, 5, 1050);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*flags*/ 1 && img.src !== (img_src_value = "assets/flags/" + /*flag*/ ctx[4].code.toLowerCase() + ".png")) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(41:4) {#each flags.slice(NB_FLAGS * 2, NB_FLAGS * 3) as flag}",
    		ctx
    	});

    	return block;
    }

    // (47:4) {#each flags.slice(NB_FLAGS * 2, NB_FLAGS * 2.5) as flag}
    function create_each_block_1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "assets/flags/" + /*flag*/ ctx[4].code.toLowerCase() + ".png")) attr_dev(img, "src", img_src_value);
    			set_style(img, "width", "calc(200vw / " + NB_FLAGS + ")");
    			attr_dev(img, "class", "svelte-19j8i1r");
    			add_location(img, file, 47, 5, 1244);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*flags*/ 1 && img.src !== (img_src_value = "assets/flags/" + /*flag*/ ctx[4].code.toLowerCase() + ".png")) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(47:4) {#each flags.slice(NB_FLAGS * 2, NB_FLAGS * 2.5) as flag}",
    		ctx
    	});

    	return block;
    }

    // (10:1) {#each new Array(2) as _}
    function create_each_block(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let t3;
    	let div2;
    	let t4;
    	let t5;
    	let each_value_6 = /*flags*/ ctx[0].slice(0, NB_FLAGS);
    	let each_blocks_5 = [];

    	for (let i = 0; i < each_value_6.length; i += 1) {
    		each_blocks_5[i] = create_each_block_6(get_each_context_6(ctx, each_value_6, i));
    	}

    	let each_value_5 = /*flags*/ ctx[0].slice(0, NB_FLAGS * 0.5);
    	let each_blocks_4 = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks_4[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	let each_value_4 = /*flags*/ ctx[0].slice(NB_FLAGS, NB_FLAGS * 2);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks_3[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	let each_value_3 = /*flags*/ ctx[0].slice(NB_FLAGS, NB_FLAGS * 1.5);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_2[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value_2 = /*flags*/ ctx[0].slice(NB_FLAGS * 2, NB_FLAGS * 3);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*flags*/ ctx[0].slice(NB_FLAGS * 2, NB_FLAGS * 2.5);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_5.length; i += 1) {
    				each_blocks_5[i].c();
    			}

    			t0 = space();

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				each_blocks_4[i].c();
    			}

    			t1 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t2 = space();

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t3 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t4 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			attr_dev(div0, "class", "row svelte-19j8i1r");
    			add_location(div0, file, 11, 3, 167);
    			attr_dev(div1, "class", "row svelte-19j8i1r");
    			add_location(div1, file, 25, 3, 558);
    			attr_dev(div2, "class", "row svelte-19j8i1r");
    			add_location(div2, file, 39, 3, 967);
    			add_location(div3, file, 10, 2, 158);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);

    			for (let i = 0; i < each_blocks_5.length; i += 1) {
    				each_blocks_5[i].m(div0, null);
    			}

    			append_dev(div0, t0);

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				each_blocks_4[i].m(div0, null);
    			}

    			append_dev(div3, t1);
    			append_dev(div3, div1);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(div1, null);
    			}

    			append_dev(div1, t2);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div1, null);
    			}

    			append_dev(div3, t3);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div2, null);
    			}

    			append_dev(div2, t4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			append_dev(div3, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*flags, NB_FLAGS*/ 1) {
    				each_value_6 = /*flags*/ ctx[0].slice(0, NB_FLAGS);
    				let i;

    				for (i = 0; i < each_value_6.length; i += 1) {
    					const child_ctx = get_each_context_6(ctx, each_value_6, i);

    					if (each_blocks_5[i]) {
    						each_blocks_5[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_5[i] = create_each_block_6(child_ctx);
    						each_blocks_5[i].c();
    						each_blocks_5[i].m(div0, t0);
    					}
    				}

    				for (; i < each_blocks_5.length; i += 1) {
    					each_blocks_5[i].d(1);
    				}

    				each_blocks_5.length = each_value_6.length;
    			}

    			if (dirty & /*flags, NB_FLAGS*/ 1) {
    				each_value_5 = /*flags*/ ctx[0].slice(0, NB_FLAGS * 0.5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks_4[i]) {
    						each_blocks_4[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_4[i] = create_each_block_5(child_ctx);
    						each_blocks_4[i].c();
    						each_blocks_4[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_4.length; i += 1) {
    					each_blocks_4[i].d(1);
    				}

    				each_blocks_4.length = each_value_5.length;
    			}

    			if (dirty & /*flags, NB_FLAGS*/ 1) {
    				each_value_4 = /*flags*/ ctx[0].slice(NB_FLAGS, NB_FLAGS * 2);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_3[i] = create_each_block_4(child_ctx);
    						each_blocks_3[i].c();
    						each_blocks_3[i].m(div1, t2);
    					}
    				}

    				for (; i < each_blocks_3.length; i += 1) {
    					each_blocks_3[i].d(1);
    				}

    				each_blocks_3.length = each_value_4.length;
    			}

    			if (dirty & /*flags, NB_FLAGS*/ 1) {
    				each_value_3 = /*flags*/ ctx[0].slice(NB_FLAGS, NB_FLAGS * 1.5);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_3(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_3.length;
    			}

    			if (dirty & /*flags, NB_FLAGS*/ 1) {
    				each_value_2 = /*flags*/ ctx[0].slice(NB_FLAGS * 2, NB_FLAGS * 3);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div2, t4);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty & /*flags, NB_FLAGS*/ 1) {
    				each_value_1 = /*flags*/ ctx[0].slice(NB_FLAGS * 2, NB_FLAGS * 2.5);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks_5, detaching);
    			destroy_each(each_blocks_4, detaching);
    			destroy_each(each_blocks_3, detaching);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(10:1) {#each new Array(2) as _}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;
    	let each_value = new Array(2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "wrapper svelte-19j8i1r");
    			add_location(div, file, 8, 0, 107);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*flags, NB_FLAGS*/ 1) {
    				each_value = new Array(2);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const NB_FLAGS = 30;

    function instance($$self, $$props, $$invalidate) {
    	let { flags } = $$props;
    	const writable_props = ["flags"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Background> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("flags" in $$props) $$invalidate(0, flags = $$props.flags);
    	};

    	$$self.$capture_state = () => {
    		return { flags };
    	};

    	$$self.$inject_state = $$props => {
    		if ("flags" in $$props) $$invalidate(0, flags = $$props.flags);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*flags*/ 1) {
    			 flags.sort(() => Math.random() >= 0.5);
    		}
    	};

    	return [flags];
    }

    class Background extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { flags: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Background",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*flags*/ ctx[0] === undefined && !("flags" in props)) {
    			console.warn("<Background> was created without expected prop 'flags'");
    		}
    	}

    	get flags() {
    		throw new Error("<Background>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flags(value) {
    		throw new Error("<Background>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 }) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* src/Card.svelte generated by Svelte v3.17.2 */
    const file$1 = "src/Card.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let div_intro;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "card svelte-1hyd45w");
    			add_location(div, file$1, 4, 0, 68);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot && default_slot.p && dirty & /*$$scope*/ 1) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[0], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null));
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fly, { x: 500, duration: 1000 });
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		
    	};

    	return [$$scope, $$slots];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/Question.svelte generated by Svelte v3.17.2 */

    const { console: console_1 } = globals;
    const file$2 = "src/Question.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (50:3) {:else}
    function create_else_block(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t;
    	let div_class_value;
    	let dispose;

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[10](/*option*/ ctx[11], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t = space();
    			if (img.src !== (img_src_value = "/assets/" + /*property*/ ctx[2] + "/" + /*option*/ ctx[11] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-10ham1r");
    			add_location(img, file$2, 54, 5, 1222);

    			attr_dev(div, "class", div_class_value = "option " + (/*selected*/ ctx[1].includes(/*option*/ ctx[11])
    			? "selected"
    			: "") + " svelte-10ham1r");

    			add_location(div, file$2, 50, 4, 1097);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t);
    			dispose = listen_dev(div, "click", click_handler_1, false, false, false);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*property, options*/ 5 && img.src !== (img_src_value = "/assets/" + /*property*/ ctx[2] + "/" + /*option*/ ctx[11] + ".png")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*selected, options*/ 3 && div_class_value !== (div_class_value = "option " + (/*selected*/ ctx[1].includes(/*option*/ ctx[11])
    			? "selected"
    			: "") + " svelte-10ham1r")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(50:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (44:3) {#if property === 'colors'}
    function create_if_block(ctx) {
    	let div;
    	let div_class_value;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[9](/*option*/ ctx[11], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			attr_dev(div, "class", div_class_value = "option " + (/*selected*/ ctx[1].includes(/*option*/ ctx[11])
    			? "selected"
    			: "") + " svelte-10ham1r");

    			set_style(div, "background-color", /*option*/ ctx[11]);
    			set_style(div, "padding-top", "calc(100% * 2/3)");
    			add_location(div, file$2, 44, 4, 884);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			dispose = listen_dev(div, "click", click_handler, false, false, false);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*selected, options*/ 3 && div_class_value !== (div_class_value = "option " + (/*selected*/ ctx[1].includes(/*option*/ ctx[11])
    			? "selected"
    			: "") + " svelte-10ham1r")) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty & /*options*/ 1) {
    				set_style(div, "background-color", /*option*/ ctx[11]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(44:3) {#if property === 'colors'}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {#each options as option}
    function create_each_block$1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*property*/ ctx[2] === "colors") return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(43:2) {#each options as option}",
    		ctx
    	});

    	return block;
    }

    // (40:0) <Card>
    function create_default_slot(ctx) {
    	let h3;
    	let t0_value = /*property*/ ctx[2].toUpperCase() + "";
    	let t0;
    	let t1;
    	let div0;
    	let t2;
    	let div1;
    	let button0;
    	let t4;
    	let button1;
    	let t5;
    	let button1_disabled_value;
    	let dispose;
    	let each_value = /*options*/ ctx[0];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div1 = element("div");
    			button0 = element("button");
    			button0.textContent = "Skip";
    			t4 = space();
    			button1 = element("button");
    			t5 = text("Next");
    			add_location(h3, file$2, 40, 1, 767);
    			attr_dev(div0, "class", "grid svelte-10ham1r");
    			add_location(div0, file$2, 41, 1, 802);
    			attr_dev(button0, "class", "skip svelte-10ham1r");
    			add_location(button0, file$2, 60, 2, 1315);
    			button1.disabled = button1_disabled_value = /*selected*/ ctx[1].length == 0;
    			attr_dev(button1, "class", "svelte-10ham1r");
    			add_location(button1, file$2, 63, 2, 1375);
    			add_location(div1, file$2, 59, 1, 1307);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div0, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button0);
    			append_dev(div1, t4);
    			append_dev(div1, button1);
    			append_dev(button1, t5);

    			dispose = [
    				listen_dev(button0, "click", /*skip*/ ctx[5], false, false, false),
    				listen_dev(button1, "click", /*submit*/ ctx[4], false, false, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*property*/ 4 && t0_value !== (t0_value = /*property*/ ctx[2].toUpperCase() + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*property, selected, options, clickHandler*/ 15) {
    				each_value = /*options*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*selected*/ 2 && button1_disabled_value !== (button1_disabled_value = /*selected*/ ctx[1].length == 0)) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div0);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(40:0) <Card>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let current;

    	const card = new Card({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const card_changes = {};

    			if (dirty & /*$$scope, selected, options, property*/ 16391) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { property } = $$props;
    	let { options } = $$props;
    	let { multiple = false } = $$props;
    	let { filtered } = $$props;
    	let { selected } = $$props;
    	const dispatch = createEventDispatcher();

    	if (property === "nbBars") {
    		options = options.filter(option => filtered.some(e => option.startsWith(e.layout)));
    		console.log(options);
    		if (options.length === 1) dispatch("skip");
    	}

    	const clickHandler = value => {
    		if (multiple) {
    			$$invalidate(1, selected = selected.includes(value)
    			? selected.filter(e => e !== value)
    			: [...selected, value]);
    		} else {
    			$$invalidate(1, selected = [value]);
    		}
    	};

    	const submit = () => {
    		dispatch("submit");
    	};

    	const skip = () => {
    		dispatch("skip");
    	};

    	const writable_props = ["property", "options", "multiple", "filtered", "selected"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Question> was created with unknown prop '${key}'`);
    	});

    	const click_handler = option => clickHandler(option);
    	const click_handler_1 = option => clickHandler(option);

    	$$self.$set = $$props => {
    		if ("property" in $$props) $$invalidate(2, property = $$props.property);
    		if ("options" in $$props) $$invalidate(0, options = $$props.options);
    		if ("multiple" in $$props) $$invalidate(6, multiple = $$props.multiple);
    		if ("filtered" in $$props) $$invalidate(7, filtered = $$props.filtered);
    		if ("selected" in $$props) $$invalidate(1, selected = $$props.selected);
    	};

    	$$self.$capture_state = () => {
    		return {
    			property,
    			options,
    			multiple,
    			filtered,
    			selected
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("property" in $$props) $$invalidate(2, property = $$props.property);
    		if ("options" in $$props) $$invalidate(0, options = $$props.options);
    		if ("multiple" in $$props) $$invalidate(6, multiple = $$props.multiple);
    		if ("filtered" in $$props) $$invalidate(7, filtered = $$props.filtered);
    		if ("selected" in $$props) $$invalidate(1, selected = $$props.selected);
    	};

    	return [
    		options,
    		selected,
    		property,
    		clickHandler,
    		submit,
    		skip,
    		multiple,
    		filtered,
    		dispatch,
    		click_handler,
    		click_handler_1
    	];
    }

    class Question extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			property: 2,
    			options: 0,
    			multiple: 6,
    			filtered: 7,
    			selected: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Question",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*property*/ ctx[2] === undefined && !("property" in props)) {
    			console_1.warn("<Question> was created without expected prop 'property'");
    		}

    		if (/*options*/ ctx[0] === undefined && !("options" in props)) {
    			console_1.warn("<Question> was created without expected prop 'options'");
    		}

    		if (/*filtered*/ ctx[7] === undefined && !("filtered" in props)) {
    			console_1.warn("<Question> was created without expected prop 'filtered'");
    		}

    		if (/*selected*/ ctx[1] === undefined && !("selected" in props)) {
    			console_1.warn("<Question> was created without expected prop 'selected'");
    		}
    	}

    	get property() {
    		throw new Error("<Question>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set property(value) {
    		throw new Error("<Question>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<Question>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Question>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiple() {
    		throw new Error("<Question>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiple(value) {
    		throw new Error("<Question>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filtered() {
    		throw new Error("<Question>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filtered(value) {
    		throw new Error("<Question>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Question>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Question>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Result.svelte generated by Svelte v3.17.2 */

    const { console: console_1$1 } = globals;
    const file$3 = "src/Result.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (20:1) {#if found.length > 1}
    function create_if_block$1(ctx) {
    	let div1;
    	let p;
    	let t1;
    	let div0;
    	let each_value = /*found*/ ctx[0].slice(1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			p = element("p");
    			p.textContent = "Alternative results";
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(p, file$3, 21, 3, 418);
    			attr_dev(div0, "class", "svelte-oqztyl");
    			add_location(div0, file$3, 22, 3, 448);
    			attr_dev(div1, "class", "alternative-results svelte-oqztyl");
    			add_location(div1, file$3, 20, 2, 381);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, p);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*found*/ 1) {
    				each_value = /*found*/ ctx[0].slice(1);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(20:1) {#if found.length > 1}",
    		ctx
    	});

    	return block;
    }

    // (24:4) {#each found.slice(1) as result}
    function create_each_block$2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "/assets/flags/" + /*result*/ ctx[3].code.toLowerCase() + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-oqztyl");
    			add_location(img, file$3, 24, 5, 496);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*found*/ 1 && img.src !== (img_src_value = "/assets/flags/" + /*result*/ ctx[3].code.toLowerCase() + ".png")) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(24:4) {#each found.slice(1) as result}",
    		ctx
    	});

    	return block;
    }

    // (17:0) <Card>
    function create_default_slot$1(ctx) {
    	let h3;
    	let t0;
    	let t1_value = /*found*/ ctx[0][0].name.toUpperCase() + "";
    	let t1;
    	let t2;
    	let t3;
    	let img;
    	let img_src_value;
    	let t4;
    	let t5;
    	let button;
    	let dispose;
    	let if_block = /*found*/ ctx[0].length > 1 && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("Is it ");
    			t1 = text(t1_value);
    			t2 = text("?");
    			t3 = space();
    			img = element("img");
    			t4 = space();
    			if (if_block) if_block.c();
    			t5 = space();
    			button = element("button");
    			button.textContent = "Identify another flag";
    			add_location(h3, file$3, 17, 1, 246);
    			if (img.src !== (img_src_value = "/assets/flags/" + /*found*/ ctx[0][0].code.toLowerCase() + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-oqztyl");
    			add_location(img, file$3, 18, 1, 293);
    			attr_dev(button, "class", "svelte-oqztyl");
    			add_location(button, file$3, 29, 1, 595);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, t1);
    			append_dev(h3, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, img, anchor);
    			insert_dev(target, t4, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, button, anchor);
    			dispose = listen_dev(button, "click", /*retry*/ ctx[1], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*found*/ 1 && t1_value !== (t1_value = /*found*/ ctx[0][0].name.toUpperCase() + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*found*/ 1 && img.src !== (img_src_value = "/assets/flags/" + /*found*/ ctx[0][0].code.toLowerCase() + ".png")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (/*found*/ ctx[0].length > 1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(t5.parentNode, t5);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t4);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(17:0) <Card>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let current;

    	const card = new Card({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const card_changes = {};

    			if (dirty & /*$$scope, found*/ 65) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { found } = $$props;
    	console.log(found);
    	const dispatch = createEventDispatcher();

    	const retry = () => {
    		dispatch("retry");
    	};

    	const writable_props = ["found"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Result> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("found" in $$props) $$invalidate(0, found = $$props.found);
    	};

    	$$self.$capture_state = () => {
    		return { found };
    	};

    	$$self.$inject_state = $$props => {
    		if ("found" in $$props) $$invalidate(0, found = $$props.found);
    	};

    	return [found, retry];
    }

    class Result extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { found: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Result",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*found*/ ctx[0] === undefined && !("found" in props)) {
    			console_1$1.warn("<Result> was created without expected prop 'found'");
    		}
    	}

    	get found() {
    		throw new Error("<Result>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set found(value) {
    		throw new Error("<Result>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Error.svelte generated by Svelte v3.17.2 */

    const { Error: Error_1 } = globals;
    const file$4 = "src/Error.svelte";

    // (12:0) <Card>
    function create_default_slot$2(ctx) {
    	let h3;
    	let t1;
    	let button;
    	let dispose;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "I don't know this flag... Are you sure it exists?";
    			t1 = space();
    			button = element("button");
    			button.textContent = "Identify another flag";
    			add_location(h3, file$4, 12, 1, 204);
    			attr_dev(button, "class", "svelte-12uus6a");
    			add_location(button, file$4, 13, 1, 264);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button, anchor);
    			dispose = listen_dev(button, "click", /*retry*/ ctx[0], false, false, false);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(12:0) <Card>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let current;

    	const card = new Card({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const card_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self) {
    	const dispatch = createEventDispatcher();

    	const retry = () => {
    		dispatch("retry");
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		
    	};

    	return [retry];
    }

    class Error$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Error",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    const colors = [
    	'black',
    	'white',
    	'red',
    	'green',
    	'blue',
    	'yellow',
    	'orange'
    ];

    const layout = [
    	'plain',
    	'barsVertical',
    	'barsHorizontal',
    	'triangle',
    	'diagonal',
    	'unionJack',
    	'stripes',
    	'cross',
    	'misc'
    ];

    const figures = [
    	'none',
    	'star',
    	'emblem',
    	'sun',
    	'crescent',
    	'bird',
    	'weapon',
    	'cross',
    	'nature',
    	'misc'
    ];

    const nbBars = [
    	'barsVertical2',
    	'barsVertical3',
    	'barsVertical4',
    	'barsHorizontal2',
    	'barsHorizontal3'
    ];

    const nbStars = [1, 2, 6];

    var options = {
    	colors,
    	layout,
    	figures,
    	nbBars,
    	nbStars
    };

    /* src/App.svelte generated by Svelte v3.17.2 */

    const { Error: Error_1$1 } = globals;

    // (164:0) {#if !mobile}
    function create_if_block_3(ctx) {
    	let current;

    	const background = new Background({
    			props: { flags: /*flags*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(background.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(background, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const background_changes = {};
    			if (dirty & /*flags*/ 2) background_changes.flags = /*flags*/ ctx[1];
    			background.$set(background_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(background.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(background.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(background, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(164:0) {#if !mobile}",
    		ctx
    	});

    	return block;
    }

    // (167:0) {#if !loading}
    function create_if_block$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_if_block_2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*property*/ ctx[5] && /*filtered*/ ctx[2].length > 1) return 0;
    		if (/*filtered*/ ctx[2].length <= 3) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(167:0) {#if !loading}",
    		ctx
    	});

    	return block;
    }

    // (184:1) {:else}
    function create_else_block$1(ctx) {
    	let current;
    	const error = new Error$1({ $$inline: true });
    	error.$on("retry", /*retry_handler_1*/ ctx[15]);

    	const block = {
    		c: function create() {
    			create_component(error.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(error, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(error.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(error.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(error, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(184:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (178:32) 
    function create_if_block_2(ctx) {
    	let current;

    	const result = new Result({
    			props: { found: /*filtered*/ ctx[2] },
    			$$inline: true
    		});

    	result.$on("retry", /*retry_handler*/ ctx[14]);

    	const block = {
    		c: function create() {
    			create_component(result.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(result, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const result_changes = {};
    			if (dirty & /*filtered*/ 4) result_changes.found = /*filtered*/ ctx[2];
    			result.$set(result_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(result.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(result.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(result, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(178:32) ",
    		ctx
    	});

    	return block;
    }

    // (168:1) {#if property && filtered.length > 1}
    function create_if_block_1(ctx) {
    	let updating_selected;
    	let current;

    	function question_selected_binding(value) {
    		/*question_selected_binding*/ ctx[13].call(null, value);
    	}

    	let question_props = {
    		property: /*property*/ ctx[5],
    		options: options[/*property*/ ctx[5]],
    		multiple: /*isMultiple*/ ctx[7],
    		filtered: /*filtered*/ ctx[2]
    	};

    	if (/*selected*/ ctx[3] !== void 0) {
    		question_props.selected = /*selected*/ ctx[3];
    	}

    	const question = new Question({ props: question_props, $$inline: true });
    	binding_callbacks.push(() => bind(question, "selected", question_selected_binding));
    	question.$on("submit", /*filterFlags*/ ctx[8]);
    	question.$on("skip", /*skipQuestion*/ ctx[9]);

    	const block = {
    		c: function create() {
    			create_component(question.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(question, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const question_changes = {};
    			if (dirty & /*property*/ 32) question_changes.property = /*property*/ ctx[5];
    			if (dirty & /*property*/ 32) question_changes.options = options[/*property*/ ctx[5]];
    			if (dirty & /*isMultiple*/ 128) question_changes.multiple = /*isMultiple*/ ctx[7];
    			if (dirty & /*filtered*/ 4) question_changes.filtered = /*filtered*/ ctx[2];

    			if (!updating_selected && dirty & /*selected*/ 8) {
    				updating_selected = true;
    				question_changes.selected = /*selected*/ ctx[3];
    				add_flush_callback(() => updating_selected = false);
    			}

    			question.$set(question_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(question.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(question.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(question, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(168:1) {#if property && filtered.length > 1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = !/*mobile*/ ctx[6] && create_if_block_3(ctx);
    	let if_block1 = !/*loading*/ ctx[0] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1$1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*mobile*/ ctx[6]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    					transition_in(if_block0, 1);
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!/*loading*/ ctx[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    					transition_in(if_block1, 1);
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let loading = true;
    	let flags = [];
    	let filtered = [];

    	csv$1("./flags.csv").then(data => {
    		data.forEach(e => {
    			e.nbStars = +e.nbStars;
    			if (e.nbStars > 1 && e.nbStars <= 5) e.nbStars = 2; else if (e.nbStars > 5) e.nbStars = 6;
    			e.layout = e.layout.split(",");
    			e.colors = e.colors.split(",");
    			e.figures = e.figures.split(",").map(d => d === "" ? "none" : d);
    		});

    		$$invalidate(1, flags = data);
    		$$invalidate(2, filtered = flags);
    		$$invalidate(0, loading = false);
    	}); // flags.forEach((flag1, i) => flags.forEach((flag2, j) => { // 	if (j <= i) return // 	if (flag1.nbBars === flag2.nbBars && flag1.nbStars === flag2.nbStars // 		&& flag1.layout.length === flag2.layout.length && flag1.layout.every(e1 => flag2.layout.some(e2 => e1 === e2))

    	let selected = [];
    	let knownProperties = {};
    	const properties = ["layout", "colors", "figures", "nbStars", "nbBars"];
    	let property = "layout";
    	let mobile = window.matchMedia("(orientation: portrait)").matches;

    	window.addEventListener("resize", () => {
    		$$invalidate(6, mobile = window.matchMedia("(orientation: portrait)").matches);
    	});

    	const getNextProperty = () => {
    		/*
    Compute available properties:
    - properties not already known
    - 'nbStars' only if 'figures' is already known and if the flag contains stars
    - 'nbBars' only if 'layout' is already knozn and if the flag contains bars
    */
    		const availableProperties = properties.filter(e => !Object.keys(knownProperties).includes(e)).filter(e => !knownProperties.figures || !knownProperties.figures.includes("star")
    		? e !== "nbStars"
    		: e).filter(e => !knownProperties.layout || !knownProperties.layout.some(e => e.startsWith("bars"))
    		? e !== "nbBars"
    		: e);

    		console.log(availableProperties);
    		if (availableProperties.length === 0) return;

    		// For each available property, compute the average number of filtered flags depending on the option chosen (only one option is considered)
    		const averages = availableProperties.reduce(
    			(acc, property) => {
    				console.log(property);

    				if (filtered.every(e => {
    					const propertyName = property === "nbBars" ? "layout" : property;
    					console.log(propertyName, filtered[0]);
    					if (Array.isArray(e[propertyName]) && e[propertyName].length === filtered[0][propertyName].length && e[propertyName].every(e1 => filtered[0][propertyName].some(e2 => e1 === e2))) return true;
    					if (!Array.isArray(e[propertyName]) && e[propertyName] == filtered[0][propertyName]) return true;
    					return false;
    				})) return { ...acc, [property]: Infinity };

    				// If the property is 'nbBars', only use options for vertical or horizontal (depending on the known layout)
    				const propertyOptions = options[property].filter(e => property === "nbBars"
    				? e.startsWith(knownProperties.layout)
    				: e);

    				const sum = propertyOptions.reduce(
    					(acc, option) => {
    						console.log(option, filtered.filter(e => {
    							const value = e[property === "nbBars" ? "layout" : property];
    							if (Array.isArray(value)) return value.some(e => e.includes(option));
    							return value === option;
    						}));

    						return acc + filtered.filter(e => {
    							const value = e[property === "nbBars" ? "layout" : property];
    							if (Array.isArray(value)) return value.some(e => e.includes(option));
    							return value === option;
    						}).length;
    					},
    					0
    				);

    				return {
    					...acc,
    					[property]: sum / propertyOptions.length
    				};
    			},
    			{}
    		);

    		console.log(averages);

    		// Return the property with the smallest average
    		return Object.entries(averages).sort((a, b) => a[1] - b[1])[0][0];
    	};

    	const filterFlags = () => {
    		$$invalidate(0, loading = true);
    		console.log(selected, property, isMultiple);

    		if (isMultiple) {
    			$$invalidate(2, filtered = filtered.filter(e => selected.reduce((acc, value) => acc && e[property].some(e => e.includes(value)), true)));
    			$$invalidate(4, knownProperties = { ...knownProperties, [property]: selected });
    		} else {
    			$$invalidate(2, filtered = filtered.filter(e => {
    				if (property === "nbBars") return e.layout.includes(selected[0]);
    				return e[property] === selected[0];
    			}));

    			$$invalidate(4, knownProperties = {
    				...knownProperties,
    				[property]: selected[0]
    			});
    		}

    		console.log(filtered);
    		console.log(knownProperties);
    		console.log(isAmbiguous);
    		$$invalidate(5, property = getNextProperty());
    		$$invalidate(3, selected = []);
    		setTimeout(() => $$invalidate(0, loading = false), 0);
    	};

    	const skipQuestion = () => {
    		$$invalidate(0, loading = true);
    		$$invalidate(3, selected = []);
    		$$invalidate(4, knownProperties = [...knownProperties, property]);
    		$$invalidate(5, property = getNextProperty());
    		setTimeout(() => $$invalidate(0, loading = false), 0);
    	};

    	function question_selected_binding(value) {
    		selected = value;
    		$$invalidate(3, selected);
    	}

    	const retry_handler = () => {
    		$$invalidate(2, filtered = flags);
    		$$invalidate(4, knownProperties = []);
    		$$invalidate(5, property = "layout");
    	};

    	const retry_handler_1 = () => {
    		$$invalidate(2, filtered = flags);
    		$$invalidate(4, knownProperties = []);
    		$$invalidate(5, property = "layout");
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("loading" in $$props) $$invalidate(0, loading = $$props.loading);
    		if ("flags" in $$props) $$invalidate(1, flags = $$props.flags);
    		if ("filtered" in $$props) $$invalidate(2, filtered = $$props.filtered);
    		if ("selected" in $$props) $$invalidate(3, selected = $$props.selected);
    		if ("knownProperties" in $$props) $$invalidate(4, knownProperties = $$props.knownProperties);
    		if ("property" in $$props) $$invalidate(5, property = $$props.property);
    		if ("mobile" in $$props) $$invalidate(6, mobile = $$props.mobile);
    		if ("isMultiple" in $$props) $$invalidate(7, isMultiple = $$props.isMultiple);
    		if ("isAmbiguous" in $$props) isAmbiguous = $$props.isAmbiguous;
    	};

    	let isMultiple;
    	let isAmbiguous;

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*filtered*/ 4) {
    			// 		&& flag1.colors.length === flag2.colors.length && flag1.colors.every(e1 => flag2.colors.some(e2 => e1 === e2))
    			// 		&& flag1.figures.length === flag2.figures.length && flag1.figures.every(e1 => flag2.figures.some(e2 => e1 === e2)))
    			// 		console.log(flag1.name, flag2.name);
    			// }));
    			// console.log(Array.from(new Set(flags.reduce((acc, value) => [...acc, ...value.figures], []))))
    			// console.log(flags.filter(e => e.figures.includes("misc")))
    			 console.log({ filtered });
    		}

    		if ($$self.$$.dirty & /*selected*/ 8) {
    			 console.log(selected);
    		}

    		if ($$self.$$.dirty & /*property*/ 32) {
    			 $$invalidate(7, isMultiple = ["layout", "colors", "figures"].includes(property));
    		}

    		if ($$self.$$.dirty & /*filtered*/ 4) {
    			 isAmbiguous = filtered.every((flag1, i) => filtered.every((flag2, j) => {
    				if (j <= i) return true;
    				return flag1.nbBars === flag2.nbBars && flag1.nbStars === flag2.nbStars && flag1.layout.length === flag2.layout.length && flag1.layout.every(e1 => flag2.layout.some(e2 => e1 === e2)) && flag1.colors.length === flag2.colors.length && flag1.colors.every(e1 => flag2.colors.some(e2 => e1 === e2)) && flag1.figures.length === flag2.figures.length && flag1.figures.every(e1 => flag2.figures.some(e2 => e1 === e2));
    			}));
    		}
    	};

    	return [
    		loading,
    		flags,
    		filtered,
    		selected,
    		knownProperties,
    		property,
    		mobile,
    		isMultiple,
    		filterFlags,
    		skipQuestion,
    		isAmbiguous,
    		properties,
    		getNextProperty,
    		question_selected_binding,
    		retry_handler,
    		retry_handler_1
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
