document.addEventListener('DOMContentLoaded', function() {
    const moodEntriesDiv = document.getElementById('mood-entries');

    window.addMoodEntry = function() {
        const selectedMood = document.querySelector('input[name="mood"]:checked').value;
        const comment = document.getElementById('mood-comment').value;
        const entryDiv = document.createElement('div');
        entryDiv.className = 'mood-entry';
        const date = new Date().toLocaleString();
        entryDiv.innerHTML = `<p>Настроение: ${selectedMood} - ${comment} <br><small>${date}</small></p>`;
        
        moodEntriesDiv.appendChild(entryDiv);

        // Очистка формы после отправки
        document.getElementById('mood-comment').value = '';
        document.querySelector('input[name="mood"]:checked').checked = false;
    }
});
