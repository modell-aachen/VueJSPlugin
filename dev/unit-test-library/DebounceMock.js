export default (func, time) => {
    return () => {
        func();
    };
};