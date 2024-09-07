class EngineRaster {
    /**
     * Изменненный алгоритм DDA растеризации линии
     * @param {number} startX - X начала линии
     * @param {number} startY - Y начала линии
     * @param {number} endX - X конца линии
     * @param {number} endY - Y конца линии
     * @param {number} sizeX - Ширина растра
     * @param {number} sizeY - Высота растра
     * @param {(x: number, y: number) => boolean} usePixel - Функция по использованию растрированных пикселей
     */
    line(startX, startY, endX, endY, sizeX, sizeY, usePixel) {
        const
            dirX = endX > startX ? sizeX : -sizeX,
            dirY = endY > startY ? sizeY : -sizeY,
            deltaX = Math.floor(Math.abs(startX - endX) / sizeX),
            deltaY = Math.floor(Math.abs(startY - endY) / sizeY);

        if (deltaX == 0 && deltaY == 0) {
            if (usePixel(startX, startY)) return;
            usePixel(endX, endY);
            return;
        }

        const numPixels = Math.abs(deltaX) > Math.abs(deltaY) ? Math.abs(deltaX) : Math.abs(deltaY),
            stepX = deltaX / numPixels,
            stepY = deltaY / numPixels;
        let x = 0.5,
            y = 0.5;

        for (let i = 0; i <= numPixels; i++) {
            if (usePixel(startX + Math.floor(x) * dirX, startY + Math.floor(y) * dirY))
                return;
            x += stepX;
            y += stepY;
        }

        usePixel(endX, endY);
        return;
    }
}