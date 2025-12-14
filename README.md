# PROJECT TITLE: CycleSync Workout Application
#### Video demo: <https://youtu.be/K1EZKChfB58>
#### Description:
A web-based application that generates personalized workouts based on menstrual cycle phases and fitness levels.

## Features

- Generates workout plans tailored to different menstrual cycle phases:
  - **Menstrual**: Gentle, restorative movement (single video)
  - **Follicular**, **Ovulation**, **Luteal**: Complete workouts with warmup, main exercises, and cool-down
- Supports different fitness levels (Beginner, Sporty)
- Database of YouTube workout videos
- Responsive web interface


## How to Use

1. Select your current menstrual cycle phase from the dropdown
2. Select your fitness level (Beginner or Sporty)
3. Click "Generate My Workout"
4. View your personalized workout plan with embedded YouTube videos


## Database Schema

The `workouts` table contains:
- `id`: Unique identifier
- `youtube_id`: YouTube video URL
- `name`: Workout title
- `duration_min`: Duration in minutes
- `cycle_phase`: Target phase (menstrual, follicular, ovulation, luteal, or all)
- `fitness_level`: Target level (beginner, sporty, or all)
- `type`: Workout type (warmup, stretch, weight, body weight, etc.)
- `channel`: YouTube channel name


## Technologies Used

- **Backend**: Python with Flask
- **Frontend**: HTML, CSS, JavaScript
- **Database**: SQLite3
- **Videos**: YouTube API integration
