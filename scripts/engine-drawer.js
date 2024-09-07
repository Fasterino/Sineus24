class EngineDrawer {
    constructor() {
        this.debugColor = '#3f3';
    }

    /**
     * Привязать движок к отрисовщику
     * @param {Engine} engine - Движок
     * @returns {this}
     */
    bind(engine) {
        this.engine = engine;
        this.canvas = this.engine.canvas.getContext('2d');

        return this;
    }
    /**
     * Установить размер шрифта
     * @param {number} size 
     */
    setFontSize(size) {
        this.canvas.font = this.canvas.font.replace(/(?<value>\d+\.?\d*)/, size);
    }

    /**
     * Загрузить ресурсы движка
     */
    async loadResources() {
        if (document.fonts)
            await document.fonts.ready;
    }

    /**
     * Подготовить канвас к отрисовке
     */
    updateCanvas() {
        const style = getComputedStyle(ROOT);
        this.canvas.clearRect(0, 0, this.engine.width, this.engine.height);
        this.canvas.fillStyle = this.canvas.strokeStyle = style.getPropertyValue('--fg');
        this.debugColor = style.getPropertyValue('--debug-color');
    }

    /**
     * Отрисовать кадр игры
     */
    draw() {
        this.updateCanvas();
        this.engine.canvas.style.border = this.engine.debug ? '1px solid var(--debug-color)' : '';
        this.engine.objects.forEach(this.drawObject.bind(this));
    }

    /**
     * Отрисовать отдельный объект
     * @param {GameObject} object - Объект для отрисовки
     */
    drawObject(object) {
        if (object.visible)
            object.draw();

        if (this.engine.debug) {
            const style = this.canvas.strokeStyle;
            this.canvas.strokeStyle = this.debugColor;

            this.canvas.strokeRect(object.computeX(), object.computeY(), object.computeWidth(), object.computeHeight());
            this.canvas.strokeStyle = style;
        }
    }
}