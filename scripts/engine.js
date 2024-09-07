const LOGIC_TEMPLATE = () => { },
    ROOT = document.documentElement;

/**
 * Теги объектов
 */
const DefaultTags = {
    None: 'None',
    Player: 'Player',
    Border: 'Border'
}

/**
 * Типы анимаций
 */
const AnimationType = {
    Cycle: 0,
    Once: 1,
    Reverse: 2,
    PingPong: 3
}


class GameObject {
    constructor() {
        this.x = this.y = this.width = this.height = 0;
        this.scale = 1;
        this.tag = DefaultTags.None;
        this.visible = true;
        this.clickState = 0;
        this.onUpdate = this.onStart = LOGIC_TEMPLATE;
        this.locals = {};
        this.animation = {
            startTick: 0,
            from: 0,
            to: 0,
            curr: 0,
            tick: 0,
            type: 0,
        }
    }

    /**
     * Возвращает, наведена ли мышка на объект
     * @returns {boolean}
     */
    isHover() {
        const rx = this.computeWidth() / 2,
            ry = this.computeHeight() / 2,
            { x, y } = this.drawer.engine.mouse;
        return (x > this.x - rx)
            && (x < this.x + rx)
            && (y > this.y - ry)
            && (y < this.y + ry);
    }

    /**
     * Возвращает, кликнул ли игрок на объект
     * @returns {boolean}
     */
    isClicked() {
        const inTouch = this.drawer.engine.mouse.inTouch;

        if (!inTouch) {
            const result = this.clickState == 2;
            this.clickState = false;
            return result && this.isHover();
        }

        if (this.clickState)
            return false;

        if (inTouch)
            this.clickState = this.isHover() ? 2 : 1;

        return false;
    }

    /**
     * Скриншотит игру в области с этим объектом и скачивает его
     */
    screenshot() {
        const canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            height = Math.round(this.computeHeight()) + 2,
            width = Math.round(this.computeWidth()) + 2;

        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = getComputedStyle(ROOT).getPropertyValue('--bg');
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(
            this.drawer.engine.canvas,
            Math.round(this.x - width / 2),
            Math.round(this.y - height / 2),
            width,
            height,
            0,
            0,
            width,
            height
        );
        const a = document.createElement('a');
        a.target = '_blank';
        a.download = 'my_record.png';
        a.href = canvas.toDataURL("image/png");
        canvas.remove();

        a.click();
        a.remove();
    }

    /**
     * Включает анимацию объекта
     * @param {number} from - Первый кадр
     * @param {number} to - Последний кадр
     * @param {number} fps - Кадры в секунду
     * @param {number} type - Тип анимации
     */
    animate(from, to, fps = 4, type = AnimationType.Cycle) {
        this.animation = {
            startTick: fps ? this.drawer.engine.logic.tick : 0,
            from,
            to,
            curr: type == AnimationType.Reverse ? to : from,
            tick: fps ? Math.round(1000 / fps) : 0,
            type
        }
    }

    /**
     * Останавливает анимацию объекта
     */
    stopAnimation() { this.animate(0, 0, 0, 0); }

    /**
     * Проверяет, включена ли анимация у объекта
     * @returns {boolean}
     */
    inAnimation() { return this.animation.tick != 0 }

    /**
     * Удаляет объект со сцены
     */
    destroy() {
        this.drawer.engine.removeObject(this);
    }

    /**
     * Клонирование объекта (без добавления на сцену)
     * @returns {GameObject}
     */
    clone() {
        const clone = new GameObject();

        for (const [key, value] of Object.entries(this))
            clone[key] = value;

        clone.locals = {};

        return clone;
    }

    /**
     * Привязка отрисовщика к объекту
     * 
     * @param {EngineDrawer} drawer - Отрисовщик сцены
     * @returns {this}
     */
    bind(drawer) {
        this.drawer = drawer;

        return this;
    }

    /**
     * Вычисляет стартовый X для отрисовки объекта
     * @returns {number}
     */
    computeX() {
        return this.x - this.computeWidth() / 2;
    }

    /**
     * Вычисляет стартовый Y для отрисовки объекта
     * @returns {number}
     */
    computeY() {
        return this.y - this.computeHeight() / 2;
    }

    /**
     * Вычисляет ширину для отрисовки объекта
     * @returns {number}
     */
    computeWidth() {
        return this.width * this.scale;
    }

    /**
     * Вычисляет высоту для отрисовки объекта
     * @returns {number}
     */
    computeHeight() {
        return this.height * this.scale;
    }

    /**
     * Функция для отрисовки объекта
     */
    draw() {
        throw new Error("draw was not defined");
    }
}

class TextObject extends GameObject {
    /** @type {'left' | 'center' | 'right'} */
    align;

    constructor() {
        super();

        this.text = "";
        this.offsets = [0];
        this.yOffset = 0;
        this.size = 20;
        this.align = 'left';
    }

    /**
     * Клонирование объекта (без добавления на сцену)
     * @returns {TextObject}
     */
    clone() {
        const clone = new TextObject();

        for (const [key, value] of Object.entries(this))
            clone[key] = value;

        clone.locals = {};

        return clone;
    }

    /**
     * Установить текст объекта
     * @param {string} text - Текст
     */
    setText(text) {
        this.text = text;

        this.updateSize();
    }

    /**
     * Установить размер шрифта
     * @param {number} size - Размер шрифта
     */
    setSize(size) {
        this.size = size;

        this.updateSize();
    }

    /**
     * Обновить размеры объекта в соответствии с размером шрифта и текстом
     */
    updateSize() {
        this.drawer.setFontSize(this.size);

        const text = this.text.split('\n');

        const { width: initWidth, emHeightAscent, hangingBaseline } = this.drawer.canvas.measureText(text[0]);
        let width = initWidth;
        this.offsets = [initWidth];
        for (let i = 1; i < text.length; i++) {
            const { width: curWidth } = this.drawer.canvas.measureText(text[i]);
            this.offsets.push(curWidth);
            if (curWidth > width) width = curWidth;
        }
        this.offsets = this.offsets.map(x => (width - x) * .5);

        this.width = width;
        this.height = this.size * text.length;
        this.yOffset = emHeightAscent || hangingBaseline || this.height * .775;
    }

    /**
     * Получить отступ по X для отдельной строчки
     * @param {number} index - Индекс линии
     * @returns {number}
     */
    getOffset(index) {
        if (this.align == 'left')
            return 0;

        return this.offsets[index] * this.scale * (this.align == 'center' ? 1 : 2);
    }

    /**
     * Функция для отрисовки объекта
     */
    draw() {
        this.drawer.setFontSize(this.size * this.scale);

        const text = this.text.split('\n');
        const x = this.computeX(),
            y = this.computeY() + this.yOffset * this.scale;

        text.forEach((line, i) => this.drawer.canvas.fillText(line, x + this.getOffset(i), y + i * this.size * this.scale));
    }
}

class GeometryObject extends GameObject {
    /** 
     * Типы геометрии
     * @typedef {{
     *  type: 'arc';
     *  from: number;
     *  to: number;
     *  cx: number;
     *  cy: number;
     *  r: number;
     *  fill: boolean;
     *  relative: boolean;
     * }|{
     *  type: 'rect';
     *  x: number;
     *  y: number;
     *  w: number;
     *  h: number;
     *  fill: boolean;
     *  relative: boolean;
     * }|{
     *  type: 'line';
     *  x1: number;
     *  y1: number;
     *  x2: number;
     *  y2: number;
     *  relative: boolean;
     * }} Geometry
     * @type {Geometry[][]}
     */
    frames;

    /**
     * @param {number} width - Ширина объекта
     * @param {number} height - Высота объекта
     */
    constructor(width, height) {
        super();

        this.width = width;
        this.height = height;

        this.text = "";
        this.frames = [[]];
        this.frame = 0;
    }

    /**
     * Добавить новый кадр анимации
     * @returns {this}
     */
    addFrame() {
        this.frame++;
        this.frames.push([]);
        return this;
    }

    /**
     * Переключить кадр вперед
     * @returns {this}
     */
    nextFrame() {
        if (++this.frame == this.frames.length)
            this.frame = 0;
        return this;
    }
    /**
     * Переключить кадр назад
     * @returns {this}
     */
    prevFrame() {
        if (this.frame-- == 0)
            this.frame += this.frames.length;
        return this;
    }

    /**
     * Установить конкретный кадр
     * @param {number} frame - Номер кадра
     * @returns {this}
     */
    setFrame(frame) {
        if (frame < 0)
            this.frame = 0;
        else if (frame >= this.frames.length)
            this.frame = this.frames.length - 1;
        else
            this.frame = frame;
        return this;
    }

    /**
     * Добавить круг
     * @param {number} cx - X центра круга
     * @param {number} cy - Y центра круга
     * @param {number} r - Радиус круга
     * @param {boolean} fill - Заполнить фигуру?
     * @param {boolean} relative - Переданы ли параметры в диапазоне от 0 до 1
     * @returns {this}
     */
    circle(cx, cy, r, fill = false, relative = true) {
        this.frames[this.frame].push({
            type: 'arc',
            from: 0,
            to: 2 * Math.PI,
            cx,
            cy,
            r,
            fill,
            relative
        });
        return this;
    }

    /**
     * Добавить дугу
     * @param {number} from - Стартовый угол
     * @param {number} to - Конечный угол
     * @param {number} cx - X центра круга
     * @param {number} cy - Y центра круга
     * @param {number} r - Радиус круга
     * @param {boolean} fill - Заполнить фигуру?
     * @param {boolean} relative - Переданы ли параметры в диапазоне от 0 до 1
     * @returns {this}
     */
    arc(from, to, cx, cy, r, fill = false, relative = true) {
        this.frames[this.frame].push({
            type: 'arc',
            from: from * Math.PI / 180,
            to: to * Math.PI / 180,
            cx,
            cy,
            r,
            fill,
            relative
        });
        return this;
    }

    /**
     * Добавить прямоугольник
     * @param {number} x - X начала прямоугольника
     * @param {number} y - Y начала прямоугольника
     * @param {number} w - Ширина прямоугольника
     * @param {number} h - Длина прямоугольника
     * @param {boolean} fill - Заполнить фигуру?
     * @param {boolean} relative - Переданы ли параметры в диапазоне от 0 до 1
     * @returns {this}
     */
    rect(x, y, w, h, fill = false, relative = true) {
        this.frames[this.frame].push({
            type: 'rect',
            x,
            y,
            w,
            h,
            fill,
            relative
        });
        return this;
    }

    /**
     * Добавить линию
     * @param {number} x1 - X начала линии
     * @param {number} y1 - Y начала линии
     * @param {number} x2 - X конца линии
     * @param {number} y2 - Y конца линии
     * @param {boolean} relative - Переданы ли параметры в диапазоне от 0 до 1
     * @returns {this}
     */
    line(x1, y1, x2, y2, relative = true) {
        this.frames[this.frame].push({
            type: 'line',
            x1,
            y1,
            x2,
            y2,
            relative
        })
        return this;
    }

    /**
     * Клонирование объекта (без добавления на сцену)
     * @returns {GeometryObject}
     */
    clone() {
        const clone = new GeometryObject();

        for (const [key, value] of Object.entries(this))
            clone[key] = value;

        clone.frame = 0;
        clone.locals = {};

        return clone;
    }

    /**
     * Функция для отрисовки объекта
     */
    draw() {
        const canvas = this.drawer.canvas;
        if (this.inAnimation())
            this.setFrame(this.animation.curr);
        this.frames[this.frame].forEach(g => {
            const xc = g.relative ? this.computeWidth() : 1,
                yc = g.relative ? this.computeHeight() : 1,
                rc = Math.min(xc, yc);
            switch (g.type) {
                case "arc":
                    canvas.beginPath();
                    canvas.arc(this.computeX() + g.cx * xc, this.computeY() + g.cy * xc, g.r * rc, g.from, g.to, false);
                    if (g.fill)
                        canvas.fill();
                    canvas.stroke();
                    canvas.closePath();
                    break;
                case "rect":
                    canvas[g.fill ? 'fillRect' : 'strokeRect'](this.computeX() + g.x * xc, this.computeY() + g.y * yc, g.w * xc, g.h * yc);
                    break;
                case "line":
                    canvas.beginPath();
                    canvas.moveTo(this.computeX() + g.x1 * xc, this.computeY() + g.y1 * yc);
                    canvas.lineTo(this.computeX() + g.x2 * xc, this.computeY() + g.y2 * yc);
                    canvas.stroke();
                    break;
            }
        });
    }
}

class PixelArtObject extends GeometryObject {
    /**
     * Загрузить пиксель-арт из строкового представления
     * @param {string} art - Строковое представление пиксель арта
     * @returns {this} 
     */
    loadArt(art) {
        const lines = art.trimEnd().split('\n');
        const width = lines.reduce((w, line) => Math.max(w, line.length), 0);
        const h = 1 / lines.length;
        const w = 1 / width;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i] + ' ',
                y = i * h;
            let j = 0, c = 0;
            while (j < line.length) {
                const x = (j - c) * w;
                if (line[j++] == ' ') {
                    if (c) {
                        this.rect(x, y, w * c, h, true, true);
                        c = 0;
                    }
                    continue;
                }

                c++;
            }
        }

        return this;
    }

    /**
     * Клонирование объекта (без добавления на сцену)
     * @returns {PixelArtObject}
     */
    clone() {
        const clone = new PixelArtObject();

        for (const [key, value] of Object.entries(this))
            clone[key] = value;

        clone.frame = 0;
        clone.locals = {};

        return clone;
    }
}

class Engine {
    /** @type {GameObject[]} */
    objects;
    /** @type {{[key: string]: HTMLAudioElement}} */
    sounds;

    /**
     * @param {number} width - Ширина игры
     * @param {number} height - Высота игры
     * @param {number} fpsCap - Ограничение по FPS, 0 - без ограничений
     */
    constructor(width, height, fpsCap = 0) {
        this.canvas = document.querySelector('canvas');
        this.debug = false;
        this.started = false;
        this.canvas.width = this.width = width;
        this.canvas.height = this.height = height;
        this.onStart = LOGIC_TEMPLATE;
        this.border = {
            top: 0,
            bottom: height,
            left: 0,
            right: width
        }
        this.utils = {
            fps: 0,
            dt: 0
        }
        this.mouse = {
            isTouch: ('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0),
            x: 0,
            y: 0,
            inTouch: false
        }
        this.math = {
            clamp: (v = 0.5, min = 0, max = 1) => v < min ? min : (v > max ? max : v),
            lerp: (a = 0, b = 1, t = 0.5) => a + (b - a) * t,
            alerp: (a = 0, b = 1, v = 0.5) => (v - a) / (b - a),
            easeInOut: (x = 0) => .5 - Math.cos(Math.PI * x) / 2,
            randFloat: (min = 1, max = 0) => this.math.lerp(min, max, Math.random()),
            randInt: (min = 1, max = 0) => Math.floor(this.math.randFloat(min, max))
        }
        this.raster = new EngineRaster();
        this.drawer = new EngineDrawer().bind(this);
        this.logic = new EngineLogic().bind(this);
        this.preferredDt = fpsCap > 0 ? Math.ceil(1000 / fpsCap) : undefined;
        this.sounds = {}
    }

    /**
     * Загрузить звук для проигрывания
     * @param {string} name - Имя звука
     */
    async loadSound(name) {
        const sound = new Audio('sounds/' + name + '.wav');
        this.sounds[name] = sound;
        return new Promise(resolve => sound.addEventListener("canplay", () => resolve()))
    }

    /**
     * Проиграть звук
     * @param {string} name - Имя звука
     */
    playSound(name) {
        const sound = this.sounds[name];

        if (sound.paused) {
            sound.play();
        } else {
            sound.currentTime = 0
        }
    }

    /**
     * Загрузить ресурсы движка
     */
    async loadResources() {
        await this.drawer.loadResources();
    }

    /**
     * Установить рамки коллизии на сцене
     * @param {keyof Engine['border']} at - Сторона рамки
     * @param {number} value - Координата рамки 
     */
    setBorder(at, value) {
        this.border[at] = value;
    }

    /**
     * Запустить сцену
     */
    start() {
        this.restart();

        setInterval(this.logic.update.bind(this.logic), this.preferredDt);
        setInterval(this.drawer.draw.bind(this.drawer), this.preferredDt);
    }

    /**
     * Перезапустить сцену
     */
    restart() {
        this.logic.reset();
        this.objects = [];
        {
            const engine = this;
            const debugText = engine.prefab(engine.createText(), prefab => {
                prefab.setSize(15);
                prefab.y = prefab.height;
                prefab.visible = false;

                const offset = prefab.height / 2;

                prefab.onUpdate = function () {
                    if (!engine.debug) {
                        this.visible = false;
                        return;
                    }
                    this.visible = true;
                    this.setText("fps: " + engine.utils.fps + ", dt: " + engine.utils.dt.toFixed(3))
                    this.x = engine.width - this.width / 2 - offset;
                }
            }),
                debugMouse = engine.prefab(engine.createGeometry(50, 50), prefab => {
                    prefab
                        //frame 0
                        .circle(.5, .5, .3).line(0, .5, 1, .5).line(.5, 0, .5, 1)

                        .addFrame() //frame 1
                        .circle(.5, .5, .3, true).line(0, .5, 1, .5).line(.5, 0, .5, 1);

                    prefab.visible = false;

                    prefab.onUpdate = function () {
                        if (!engine.debug) {
                            this.visible = false;
                            return;
                        }
                        this.visible = true;
                        this.setFrame(engine.mouse.inTouch ? 1 : 0);
                        this.x = engine.mouse.x;
                        this.y = engine.mouse.y;
                    }
                });

            engine.instantiate(debugText);
            engine.instantiate(debugMouse);
        }
        this.onStart();
    }

    /**
     * Создать префаб
     * @template {GameObject} T
     * @param {T} object - Основа префаба
     * @param {(prefab: T) => void} setUp - Функция настройки префаба
     * @returns {T}
     */
    prefab(object, setUp) {
        setUp(object);
        return object;
    }

    /**
     * Перезаписать функции по типу onStart, onUpdate...
     * @param {() => void} oldFunc - старая функция
     * @param {(_super: () => void) => void} newFunc - новая функция
     * @returns {() => void}
     */
    override(oldFunc, newFunc) {
        return function () { return newFunc.call(this, () => oldFunc.call(this)) };
    }

    /**
     * Создать текстовый объект
     * @returns {TextObject}
     */
    createText() {
        return new TextObject().bind(this.drawer);
    }

    /**
     * Создать объект с геометрией
     * @param {number} width - Ширина объекта
     * @param {number} height - Высота объекта
     * @returns {GeometryObject}
     */
    createGeometry(width, height) {
        return new GeometryObject(width, height).bind(this.drawer);
    }

    /**
     * Создать объект, который поддерживает пиксель-арт
     * @param {number} width - Ширина объекта
     * @param {number} height - Высота объекта
     * @returns {PixelArtObject}
     */
    createPixelArt(width, height) {
        return new PixelArtObject(width, height).bind(this.drawer);
    }

    /**
     * Cоздать экземпляр объекта/префаба на сцене
     * @template {GameObject} T
     * @param {T} object - Объект/префаб
     * @returns {T} - Клон объекта
     */
    instantiate(object) {
        const clone = object.clone();
        this.objects.push(clone);
        this.logic.addObject(clone)
        return clone;
    }

    /**
     * Найти один объект на сцене по тегу
     * @param {string} tag - Тег объекта
     * @returns {GameObject | null} - Объект или ничего
     */
    findByTag(tag) {
        for (const object of this.objects) {
            if (object.tag == tag)
                return object;
        }
        return null;
    }

    /**
     * Найти все объекты на сцене по тегу
     * @param {string} tag - Тег объекта
     * @returns {GameObject[]} - Список из объектов
     */
    findAllByTag(tag) {
        return this.objects.filter(x => x.tag == tag);
    }

    /**
     * Запустить корутину
     * @param {number} ms - Время в мс
     * @param {CoroutineProgressFunc} progress - Функция прогресса корутины (передает число от 0 до 1)
     * @param {CoroutineEndFunc} end - Функция завершения корутины
     */
    coroutine(ms, progress, end) {
        this.logic.coroutine(ms, progress, end);
    }

    /**
     * Запустить корутину без функции прогресса
     * @param {number} ms - Время в мс
     * @param {CoroutineEndFunc} end - Функция завершения корутины
     */
    wait(ms, end) {
        this.coroutine(ms, undefined, end);
    }

    /**
     * Проверить коллизии с объектом
     * @param {GameObject} object - Объект, для проверки
     * @param {string[] | undefined} mask - Список из тегов объектов, подходящих для проверки
     * @returns {Сollision[]} - Список найденных коллизий
     */
    checkCollisions(object, mask) {
        return this.logic.checkCollisions(object, mask);
    }

    /**
     * Проверить коллизии с объектом с помощью псевдо Рейкаста
     * @param {GameObject} object - Объект, для проверки
     * @param {string[] | undefined} mask - Список из тегов объектов, подходящих для проверки
     * @param {[number, number]} ray - Вектор луча
     * @returns {CollisionDumbcast | null} - Найденная коллизия
     */
    checkCollisionDumbcast(object, mask, ray) {
        return this.logic.checkCollisionDumbcast(object, mask, ray);
    }

    /**
     * Добавить обработчик, при нажатии на определенную клавишу
     * @param {string} key - Клавиша
     * @param {() => void} callback - Обрабочик 
     */
    keyPressed(key, callback) {
        this.logic.keyPressed(key, callback);
    }

    /**
     * Удалить объект со цены
     * @param {GameObject} object - Объект, который нужно удалить
     */
    removeObject(object) {
        this.objects.splice(this.objects.indexOf(object), 1);
    }

    /**
     * Сохранить данные в локальном хранилище
     * @template T
     * @param {string} key - Ключ
     * @param {T} value - Значение, для сохранения
     */
    save(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    /**
     * Загрузить данные из локального хранилища
     * @template T
     * @param {string} key - Ключ
     * @param {T} defaultValue - Значение, если данные не будут найдены
     * @returns {T} - Загруженные данные
     */
    load(key, defaultValue) {
        const value = localStorage.getItem(key);
        return value === null ? defaultValue : JSON.parse(value);
    }
}