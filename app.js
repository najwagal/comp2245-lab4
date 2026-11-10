document.addEventListener('DOMContentLoaded', () => {
    const subjectSelect = document.querySelector('#subject');
    const searchForm = document.querySelector('#search-form'); 
    const resultsTableBody = document.querySelector('table tbody'); 
    const statusDiv = document.querySelector('#status');
    const searchButton = searchForm.querySelector('button, input[type="submit"]');
    const availableCheckbox = searchForm.querySelector('input[name="available"]');
    const queryInput = searchForm.querySelector('input[name="q"]');

    // 1. Fetch subjects.php when the page loads
    fetch('subjects.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load subjects');
            }
            return response.json();
        })
        .then(subjects => {
            subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject.id;
                option.textContent = subject.name;
                subjectSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching subjects:', error);
        });

    // Function to fetch and display books
    function loadBooks(event) {
        if (event) {
            event.preventDefault(); // Prevent full page reload on submit
        }

        // 2. While search is running, disable the Search button and set #status to "Searching…"
        if (searchButton) {
            searchButton.disabled = true;
        }
        statusDiv.textContent = 'Searching…';

        // 1. Build the query string from the form
        const params = new URLSearchParams(new FormData(searchForm)).toString();

        fetch(`books.php?${params}`)
            .then(response => {
                // 2. Check response.ok
                if (!response.ok) {
                    throw new Error('Failed to fetch books');
                }
                return response.json();
            })
            .then(books => {
                // Set status message based on results count
                if (books.length === 0) {
                    statusDiv.textContent = 'No books match your search.';
                } else if (books.length === 1) {
                    statusDiv.textContent = '1 book found.';
                } else {
                    statusDiv.textContent = `${books.length} books found.`;
                }

                // Build table rows
                const rows = books.map(book => {
                    const tr = document.createElement('tr');

                    const titleTd = document.createElement('td');
                    titleTd.textContent = book.title;

                    const authorTd = document.createElement('td');
                    authorTd.textContent = book.author;

                    const yearTd = document.createElement('td');
                    yearTd.textContent = book.year;

                    const subjectTd = document.createElement('td');
                    subjectTd.textContent = book.subject;

                    const shelfTd = document.createElement('td');
                    shelfTd.textContent = `${book.available} of ${book.copies}`;

                    // If no copies are on the shelf, add the 'out' class
                    if (Number(book.available) === 0) {
                        shelfTd.classList.add('out');
                    }

                    tr.append(titleTd, authorTd, yearTd, subjectTd, shelfTd);
                    return tr;
                });

                resultsTableBody.replaceChildren(...rows);
            })
            .catch(error => {
                // 3. If a search fails, empty the table and set #status
                console.error('Error fetching books:', error);
                resultsTableBody.replaceChildren();
                statusDiv.textContent = "Couldn't load the books. Please try again.";
            })
            .finally(() => {
                // 2. Enable the button again when the search ends, whether it worked or not
                if (searchButton) {
                    searchButton.disabled = false;
                }
            });
    }

    // Call function when the page loads to show every book
    loadBooks();

    // Call function when the form is submitted
    searchForm.addEventListener('submit', loadBooks);

    // 1. Run the search when the Subject list or the checkbox changes
    if (subjectSelect) {
        subjectSelect.addEventListener('change', loadBooks);
    }
    if (availableCheckbox) {
        availableCheckbox.addEventListener('change', loadBooks);
    }

    // Optional: live search as typing in query
    if (queryInput) {
        queryInput.addEventListener('input', loadBooks);
    }
});