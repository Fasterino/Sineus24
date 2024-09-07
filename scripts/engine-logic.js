
/**
 * @typedef {((t: number) => void) | undefined} CoroutineProgressFunc
 * @typedef {(() => void) | undefined} CoroutineEndFunc
 * @typedef {{
 *  starts: number; 
 *  ends: number;
 *  progress: CoroutineProgressFunc; 
 *  end: CoroutineEndFunc;
 * }} Coroutine
 * @typedef {{
 *  other?: GameObject;
 *  tag: string;
 *  at: 'top' | 'bottom' | 'left' | 'right';
 * }} Collision
 * @typedef {Collision & {
 *  atCoord: number;
 * }} CollisionDumbcast
 */

class EngineLogic {
    /** @type {Coroutine[]} */
    coroutines;


    constructor() {
        this.tick = Date.now();
    }

    /**
     * Сбросить логику
     */
    reset() {
        this.coroutines = [];
    }

    /**
     * Запустить корутину
     * @param {number} ms - Время в мс
     * @param {CoroutineProgressFunc} progress - Функция прогресса корутины (передает число от 0 до 1)
     * @param {CoroutineEndFunc} end - Функция завершения корутины
     */
    coroutine(ms, progress, end) {
        /** @type {Coroutine} */
        const coroutine = {
            starts: this.tick,
            ends: this.tick + ms,
            progress,
            end
        };

        // for (let i = 0; i < this.coroutines.length; i++) {
        //     if (this.coroutines[i].ends < coroutine.ends) continue;
        //     this.coroutines.splice(i, 0, coroutine);
        //     return;
        // }

        this.coroutines.push(coroutine);
    }

    /**
     * Получение координаты мышки, либо прикосновения
     * @param {{clientX: number, clientY: number}} touch - Часть js ивента
     */
    getMouseXY(touch) {
        const rect = this.engine.canvas.getBoundingClientRect(),
            x = (touch.clientX - rect.left) / (rect.right - rect.left) * this.engine.width,
            y = (touch.clientY - rect.top) / (rect.bottom - rect.top) * this.engine.height;

        this.engine.mouse.x = this.engine.math.clamp(x, 0, this.engine.width);
        this.engine.mouse.y = this.engine.math.clamp(y, 0, this.engine.height);
    }

    /**
     * Привязать движок к логической части
     * @param {Engine} engine - Движок
     * @returns {this}
     */
    bind(engine) {
        this.engine = engine;
        if (this.engine.mouse.isTouch) {
            document.addEventListener('touchstart', e => {
                e.preventDefault();
                this.getMouseXY(e.touches[0]);
                this.engine.mouse.inTouch = true;
            });
            document.addEventListener('touchmove', e => {
                e.preventDefault();
                this.getMouseXY(e.touches[0]);
            });
            document.addEventListener('touchend', e => {
                e.preventDefault();
                this.engine.mouse.inTouch = e.touches.length > 0;
            });
        }
        else {
            this.engine.canvas.addEventListener('mousemove', e => this.getMouseXY(e));
            document.addEventListener('mousedown', () => {
                this.engine.mouse.inTouch = true;
            });
            document.addEventListener('mouseup', () => {
                this.engine.mouse.inTouch = false;
            });
            document.addEventListener('keyup', e => {
                if (e.code == 'KeyO') this.engine.debug ^= 1;
                if (e.code == 'KeyR') this.engine.restart();
            });
        }

        return this;
    }

    /**
     * Проверить коллизии с объектом
     * @param {GameObject} object - Объект, для проверки
     * @param {string[] | undefined} mask - Список из тегов объектов, подходящих для проверки
     * @returns {Сollision[]} - Список найденных коллизий
     */
    checkCollisions(object, mask) {
        const
            /** @type { Collision[] } */
            collisions = [],
            hr = object.computeWidth() / 2, vr = object.computeHeight() / 2,
            x = object.x, y = object.y;

        if (mask.includes(DefaultTags.Border)) {
            if (x <= this.engine.border.left + hr)
                collisions.push({ tag: DefaultTags.Border, at: 'left' });
            else if (x >= this.engine.border.right - hr)
                collisions.push({ tag: DefaultTags.Border, at: 'right' });
            if (y <= this.engine.border.top + vr)
                collisions.push({ tag: DefaultTags.Border, at: 'top' });
            else if (y >= this.engine.border.bottom - vr)
                collisions.push({ tag: DefaultTags.Border, at: 'bottom' });
        }

        this.engine.objects.forEach(other => {
            const tag = other.tag;
            if (other == object || (mask ? !mask.includes(tag) : tag == DefaultTags.None)) return;

            const ohr = other.computeWidth() / 2 + 1, ovr = other.computeHeight() / 2 + 1,
                ox = other.x, oy = other.y;

            const hcd = Math.abs(x - ox), vcd = Math.abs(y - oy),
                hrs = (hr + ohr), vrs = (vr + ovr);

            if ((hcd <= hrs)
                && (vcd <= vrs)) {
                const hc = hrs - hcd,
                    vc = vrs - vcd;

                let at;
                if (hc < vc)
                    at = x > ox ? 'left' : 'right';
                else
                    at = y > oy ? 'top' : 'bottom';

                collisions.push({
                    other,
                    tag,
                    at
                });
            }
        });

        return collisions;
    }

    /**
     * Проверить коллизии с объектом с помощью псевдо Рейкаста
     * @param {GameObject} object - Объект, для проверки
     * @param {string[] | undefined} mask - Список из тегов объектов, подходящих для проверки
     * @param {[number, number]} ray - Вектор луча
     * @returns {CollisionDumbcast | null} - Найденная коллизия
     */
    checkCollisionDumbcast(object, mask, ray) {
        const
            startX = object.x,
            startY = object.y,
            endX = startX + ray[0],
            endY = startY + ray[1],
            sizeX = object.computeWidth(),
            sizeY = object.computeHeight();

        /**
         * @type {CollisionDumbcast | null}
         */
        let collision = null;

        this.engine.raster.line(startX, startY, endX, endY, sizeX, sizeY, (x, y, stop) => {
            object.x = x;
            object.y = y;
            const collisions = this.checkCollisions(object, mask);
            if (collisions.length == 0) return false;
            collision = collisions[0];
            if (collision.tag == DefaultTags.Border)
                collision.atCoord = this.engine.border[collision.at];
            else {
                const other = collision.other;
                switch (collision.at) {
                    case "top":
                        collision.atCoord = other.y + other.computeHeight() / 2;
                        break;
                    case "bottom":
                        collision.atCoord = other.y - other.computeHeight() / 2;
                        break;
                    case "left":
                        collision.atCoord = other.x + other.computeWidth() / 2;
                        break;
                    case "right":
                        collision.atCoord = other.x - other.computeWidth() / 2;
                        break;
                }
            }
            return true;
        });

        object.x = startX;
        object.y = startY;

        if (collision)
            switch (collision.at) {
                case "top":
                    collision.atCoord += sizeY / 2;
                    break;
                case "bottom":
                    collision.atCoord -= sizeY / 2;
                    break;
                case "left":
                    collision.atCoord += sizeX / 2;
                    break;
                case "right":
                    collision.atCoord -= sizeX / 2;
                    break;
            }

        return collision;
    }


    /**
     * Добавить обработчик, при нажатии на определенную клавишу
     * @param {string} key - Клавиша
     * @param {() => void} callback - Обрабочик 
     */
    keyPressed(key, callback) {
        document.addEventListener('keyup', e => {
            if (e.code == key) callback();
        });
    }

    /**
     * Функция обновления логики игры
     */
    update() {
        const tick = Date.now();
        this.engine.utils.dt = (tick - this.tick) * 0.001;
        this.engine.utils.fps = Math.floor(1 / this.engine.utils.dt);
        const toDelete = [];
        this.coroutines.forEach(coroutine => {
            const progress = this.engine.math.alerp(coroutine.starts, coroutine.ends, tick);
            if (coroutine.progress)
                coroutine.progress(progress > 1 ? 1 : progress);
            if (progress >= 1) {
                toDelete.push(coroutine);
                if (coroutine.end)
                    coroutine.end();
            }
        });
        toDelete.forEach(element => {
            const index = this.coroutines.indexOf(element);
            this.coroutines.splice(index, 1);
        });

        this.engine.objects.forEach(x => {
            if (x.inAnimation())
                this.animate(x);
            x.onUpdate.call(x);
        });
        this.tick = tick;
    }

    /**
     * Обновить анимацию объекта
     * @param {GameObject} object - Объект
     * @returns 
     */
    animate(object) {
        if ((object.animation.type == AnimationType.Once)
            && (object.animation.curr == object.animation.to))
            return;

        const frame = Math.round((this.tick - object.animation.startTick) / object.animation.tick);

        if ((object.animation.type == AnimationType.Once)
            && (frame >= object.animation.to - object.animation.from)) {
            object.animation.curr = object.animation.to;
            return;
        }
        const curOffset = frame %
            (object.animation.to - object.animation.from + 1);

        const odd = Math.floor(
            frame / (object.animation.to - object.animation.from + 1)
        ) % 2;


        object.animation.curr = (object.animation.type == AnimationType.Reverse)
            || (odd && object.animation.type == AnimationType.PingPong) ?
            object.animation.to - curOffset :
            object.animation.from + curOffset;
    }

    /**
     * Активировать логику объекта
     * @param {GameObject} object - Объект, для активации
     * @returns {GameObject} - Тот же самый объект
     */
    addObject(object) {
        object.onStart();
        return object;
    }
}