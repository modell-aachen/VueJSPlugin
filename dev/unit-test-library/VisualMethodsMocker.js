export default {
    mock() {
        window.requestAnimationFrame = jasmine.createSpy(() => {});
    }
};
