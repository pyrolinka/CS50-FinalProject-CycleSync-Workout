console.log('Script loaded!');

document.getElementById('workoutForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    console.log('Form submitted!');

    const cyclePhase = document.getElementById('cyclePhase').value;
    const fitnessLevel = document.getElementById('fitnessLevel').value;

    console.log('Cycle Phase:', cyclePhase);
    console.log('Fitness Level:', fitnessLevel);

    if (!cyclePhase || !fitnessLevel) {
        alert('Please select both options');
        return;
    }

    try {
        console.log('Sending request...');
        const response = await fetch('/generate_workout', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                cycle_phase: cyclePhase,
                fitness_level: fitnessLevel
            })
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error('Server error: ' + response.status);
        }

        const data = await response.json();
        console.log('Received data:', data);
        showWorkout(data);

    } catch (error) {
        console.error('ERROR:', error);
        alert('Error generating workout: ' + error.message);
    }
});

function showWorkout(data) {
    console.log('Showing workout, type:', data.type);

    document.getElementById('results').style.display = 'block';

    if (data.type === 'menstrual') {
        console.log('Displaying menstrual workout');
        // Show menstrual workout
        document.getElementById('menstrualWorkout').style.display = 'block';
        document.getElementById('regularWorkout').style.display = 'none';
        document.getElementById('menstrual').innerHTML = makeVideo(data.workout);
        console.log('Menstrual video added');

    } else {
        console.log('Displaying regular workout');
        // Show regular workout
        document.getElementById('menstrualWorkout').style.display = 'none';
        document.getElementById('regularWorkout').style.display = 'block';

        console.log('Adding warmup...');
        document.getElementById('warmup').innerHTML = makeVideo(data.warmup);

        console.log('Adding stretch...');
        document.getElementById('stretch').innerHTML = makeVideo(data.stretch);

        console.log('Setting total time:', data.total_duration);
        document.getElementById('totalTime').textContent = 'Total: ' + data.total_duration + ' minutes';

        console.log('Adding main workouts, count:', data.main.length);
        let mainHTML = '';
        data.main.forEach((video, i) => {
            mainHTML += makeVideo(video, i + 1);
        });
        document.getElementById('mainVideos').innerHTML = mainHTML;
        console.log('All videos added');
    }

    console.log('Scrolling to results...');
    document.getElementById('results').scrollIntoView({behavior: 'smooth'});
    console.log('Done!');
}

function makeVideo(video, number) {
    if (!video) {
        console.log('No video to display');
        return '';
    }

    console.log('Creating video for:', video.name);
    const videoId = getYouTubeID(video.youtube_id);
    console.log('YouTube ID:', videoId);
    const num = number ? number + '. ' : '';

    return `
        <div class="video-box">
            <h3>${num}${video.name}</h3>
            <p>${video.duration_min} min • ${video.channel}</p>
            <iframe
                width="100%"
                height="400"
                src="https://www.youtube.com/embed/${videoId}"
                frameborder="0"
                allowfullscreen>
            </iframe>
        </div>
    `;
}

function getYouTubeID(url) {
    if (url.includes('youtu.be/')) {
        return url.split('youtu.be/')[1].split('?')[0];
    }
    if (url.includes('watch?v=')) {
        return url.split('v=')[1].split('&')[0];
    }
    return url;
}
