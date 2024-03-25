// Defines a debounce function to limit the rate at which a function can fire.
// This is particularly useful for events that occur rapidly, such as typing in an input field.
const debounce = (func, delay = 1000) => {
    // Holds the ID of the timeout to clear it if the function is invoked again within the delay period.
    let timeoutId;

    // Returns a new function that wraps the original function with the debounce logic.
    return (...args) => {
        // If there is an existing timeout, clear it to reset the debounce timer.
        // This prevents the function from executing if the returned function is called again within the delay.
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Set a new timeout to invoke the original function after the delay has passed.
        // This ensures the function only executes once per the specified delay period.
        timeoutId = setTimeout(() => {
            // Use .apply to call the original function with the correct `this` context and arguments.
            func.apply(null, args);
        }, delay);
    };
};
