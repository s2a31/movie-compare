// The createAutoComplete function configures the autocomplete feature for a given input field.
const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {
    // Insert HTML structure for the autocomplete dropdown into the root element
    root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input" />
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
    `;

    // Select DOM elements within the root element for further manipulation
    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');

    // Define the onInput function, triggered whenever the user inputs text
    const onInput = async (event) => {
        const items = await fetchData(event.target.value); // Fetch data based on the input value
        if (!items.length) {
            dropdown.classList.remove('is-active'); // Hide the dropdown if no items were fetched
            return;
        }
        resultsWrapper.innerHTML = ''; // Clear previous results
        dropdown.classList.add('is-active'); // Display the dropdown

        // Iterate over each item fetched and append it to the results wrapper as a clickable option
        for (let item of items) {
            const option = document.createElement('a');

            option.classList.add('dropdown-item');
            option.innerHTML = renderOption(item); // Use the renderOption function to generate the HTML for this item
            option.addEventListener('click', () => {
                dropdown.classList.remove('is-active'); // Hide the dropdown when an option is selected
                input.value = inputValue(item); // Update the input field with the value of the selected item
                onOptionSelect(item); // Trigger any additional behavior defined for when an option is selected
            });

            resultsWrapper.appendChild(option); // Append the option to the results wrapper
        }
    };

    // Attach the debounced onInput function to the input event of the input field
    input.addEventListener('input', debounce(onInput, 500));

    // Close the dropdown if the user clicks anywhere outside of the autocomplete widget
    document.addEventListener('click', (event) => {
        if (!root.contains(event.target)) {
            dropdown.classList.remove('is-active');
        }
    });
};
