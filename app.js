document.addEventListener('DOMContentLoaded', () => {
    const subjectSelect = document.querySelector('#subject');

    // 1. Fetch subjects.php when the page loads
    fetch('subjects.php')
        .then(response => {
            // 2. Check response.ok; throw an error if false
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(subjects => {
            // 3. For each subject, create an option element and append it to the select dropdown
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
});