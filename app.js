document.addEventListener('DOMContentLoaded', () => {
    const subjectSelect = document.querySelector('#subject');
    const searchForm = document.querySelector('#search-form'); 
    const resultsTableBody = document.querySelector('table tbody'); 
    const statusDiv = document.querySelector('#status');

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

        // Build query string from the form
        const params = new URLSearchParams(new FormData(searchForm)).toString();

        fetch(`books.php?${params}`)
            .then(response => {
                // Check response.ok
                if (!response.ok) {
                    throw new Error('Failed to fetch books');
                }
                return response.json();
            })
            .then(books => {
                // Update #status message based on results count
                if (books.length === 0) {
                    statusDiv.textContent = 'No books match your search.';
                } else if (books.length === 1) {
                    statusDiv.textContent = '1 book found.';
                } else {
                    statusDiv.textContent = `${books.length} books found.`;
                }

                // Map and build table rows using replaceChildren
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
                console.error('Error fetching books:', error);
                statusDiv.textContent = 'An error occurred while fetching books.';
            });
    }

    // Call function when the page loads to show every book
    loadBooks();

    // Call function when the form is submitted
    searchForm.addEventListener('submit', loadBooks);

    // Optional: Update dynamically as the user types or toggles filters
    searchForm.addEventListener('input', loadBooks);
    searchForm.addEventListener('change', loadBooks);
});