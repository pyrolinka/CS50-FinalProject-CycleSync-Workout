from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/generate_workout', methods=['POST'])
def generate_workout():
    data = request.get_json()
    cycle_phase = data['cycle_phase']
    fitness_level = data['fitness_level']

    print(f"\n=== NEW REQUEST ===")
    print(f"Cycle Phase: {cycle_phase}")
    print(f"Fitness Level: {fitness_level}")

    conn = sqlite3.connect('workouts.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # MENSTRUAL PHASE - Just 1 video
    if cycle_phase == 'menstrual':
        print("Generating MENSTRUAL workout...")
        query = '''SELECT * FROM "workouts"
                   WHERE cycle_phase = ?
                   ORDER BY RANDOM() LIMIT 1'''
        workout = cursor.execute(query, ('menstrual',)).fetchone()
        conn.close()

        if workout:
            print(f"Found: {workout['name']}")
            return jsonify({
                'type': 'menstrual',
                'workout': dict(workout)
            })
        else:
            print("ERROR: No menstrual workout found!")
            return jsonify({'error': 'No workout found'}), 404

    # OTHER PHASES - Warmup + Main + Stretch
    else:
        print("Generating REGULAR workout...")

        # Get 1 warmup
        warmup = cursor.execute('''SELECT * FROM "workouts"
                                   WHERE type = "warmup"
                                   ORDER BY RANDOM() LIMIT 1''').fetchone()
        print(f"Warmup: {warmup['name'] if warmup else 'None'}")

        # Get 1 stretch
        stretch = cursor.execute('''SELECT * FROM "workouts"
                                    WHERE type = "stretch"
                                    ORDER BY RANDOM() LIMIT 1''').fetchone()
        print(f"Stretch: {stretch['name'] if stretch else 'None'}")

        # Get main workouts for this phase
        query = '''SELECT * FROM "workouts"
                   WHERE (cycle_phase = ? OR cycle_phase = "all")
                   AND (fitness_level = ? OR fitness_level = "all")
                   AND type NOT IN ("warmup", "stretch")
                   ORDER BY RANDOM()'''

        all_main = cursor.execute(query, (cycle_phase, fitness_level)).fetchall()
        conn.close()

        print(f"Found {len(all_main)} potential main workouts")

        # Build workout 30-50 min
        main_workouts = []
        total_time = 0

        for w in all_main:
            if total_time >= 30 and total_time <= 50:
                break
            if total_time + w['duration_min'] <= 50:
                main_workouts.append(dict(w))
                total_time += w['duration_min']
                print(f"  Added: {w['name']} ({w['duration_min']} min)")
            if total_time >= 30:
                break

        print(f"Total workout time: {total_time} minutes")
        print("===================\n")

        return jsonify({
            'type': 'regular',
            'warmup': dict(warmup) if warmup else None,
            'main': main_workouts,
            'total_duration': total_time,
            'stretch': dict(stretch) if stretch else None
        })

if __name__ == '__main__':
    app.run(debug=True)
