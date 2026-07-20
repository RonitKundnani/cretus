-- ============================================================================
-- CRETUS 2026 — seed data (realistic placeholders)
-- Idempotent & re-runnable. Uses dollar-quoted strings ($md$…$md$) for text so
-- the Supabase SQL editor handles newlines/markdown reliably (same style the
-- migrations use). Replace with real content via the admin app later.
-- ============================================================================

-- Committee (placeholders) ---------------------------------------------------
insert into committee_members (name, role, tenure_year, sort_order)
select 'Sarthak Mehta', 'Faculty Coordinator', '2025-26', 1
where not exists (select 1 from committee_members where name = 'Sarthak Mehta');
insert into committee_members (name, role, tenure_year, sort_order)
select 'Dhruv Ribbonwala', 'Club President', '2025-26', 2
where not exists (select 1 from committee_members where name = 'Dhruv Ribbonwala');
insert into committee_members (name, role, tenure_year, sort_order)
select 'Aarav Shah', 'Vice President', '2025-26', 3
where not exists (select 1 from committee_members where name = 'Aarav Shah');
insert into committee_members (name, role, tenure_year, sort_order)
select 'Isha Patel', 'Technical Lead', '2025-26', 4
where not exists (select 1 from committee_members where name = 'Isha Patel');
insert into committee_members (name, role, tenure_year, sort_order)
select 'Rohan Desai', 'Events Head', '2025-26', 5
where not exists (select 1 from committee_members where name = 'Rohan Desai');
insert into committee_members (name, role, tenure_year, sort_order)
select 'Meera Joshi', 'Design Lead', '2025-26', 6
where not exists (select 1 from committee_members where name = 'Meera Joshi');

-- Featured project: Chess-Playing Robot -------------------------------------
insert into projects (title, slug, tagline, status, code_repo_url, published)
values (
  'Chess-Playing Robot',
  'chess-playing-robot',
  'An autonomous robot that sees the board, decides its move, and plays it with a robotic arm.',
  'ongoing',
  'https://github.com/Cretus-PDPU/',
  true
)
on conflict (slug) do nothing;

-- Project sections (one insert each; references the project directly) --------
insert into project_sections (project_id, heading, body_md, sort_order)
select p.id, 'Description', $md$The Chess-Playing Robot combines three subsystems into a single autonomous player:

- **A brain** - an AI engine that reads the current board state and decides the best move.
- **A robotic arm** - a mechanical arm that physically picks up and places pieces.
- **A sensory chessboard** - a sensor-equipped board that tracks piece positions in real time.$md$, 1
from projects p
where p.slug = 'chess-playing-robot'
  and not exists (select 1 from project_sections ps where ps.project_id = p.id and ps.heading = 'Description');

insert into project_sections (project_id, heading, body_md, sort_order)
select p.id, 'Components Required', $md$| Component | Qty | Notes |
|---|---|---|
| Arduino Mega / ESP32 | 1 | Main controller |
| Reed switches / Hall sensors | 64 | One per square |
| Stepper motors | 3 | Arm joints + gantry |
| Electromagnet | 1 | Piece pickup |
| Motor drivers (A4988) | 3 | Stepper control |
| 12V power supply | 1 | Motors |$md$, 2
from projects p
where p.slug = 'chess-playing-robot'
  and not exists (select 1 from project_sections ps where ps.project_id = p.id and ps.heading = 'Components Required');

insert into project_sections (project_id, heading, body_md, sort_order)
select p.id, 'Code & Repository', $md$The firmware and move-engine bridge live in the club GitHub org.

Repo: https://github.com/Cretus-PDPU/$md$, 3
from projects p
where p.slug = 'chess-playing-robot'
  and not exists (select 1 from project_sections ps where ps.project_id = p.id and ps.heading = 'Code & Repository');

insert into project_sections (project_id, heading, body_md, sort_order)
select p.id, 'Common Issues Faced', $md$- **Sensor cross-talk** on adjacent squares - solved with shielding and per-square debouncing.
- **Arm calibration drift** over long games - added a homing routine before each move.
- **Piece slippage** on the electromagnet - tuned magnet strength and pickup dwell time.$md$, 4
from projects p
where p.slug = 'chess-playing-robot'
  and not exists (select 1 from project_sections ps where ps.project_id = p.id and ps.heading = 'Common Issues Faced');

-- Sample blog post -----------------------------------------------------------
insert into blog_posts (title, slug, excerpt, content_md, author, tags, published, published_at)
values (
  'WAYMO - The Driverless Car Revolution',
  'waymo-driverless-car-revolution',
  'How autonomous vehicles perceive the world, plan paths, and what it means for robotics.',
  $md$# WAYMO - The Driverless Car Revolution

Autonomous vehicles fuse LiDAR, radar, and cameras to build a live model of the world, then plan safe paths through it.

## Perception
Sensor fusion turns raw signals into a labelled scene - cars, pedestrians, lanes.

## Planning
The planner predicts what everything nearby will do next, then chooses a trajectory.

*This is a placeholder post - replace it from the admin app.*$md$,
  'Cretus',
  ARRAY['autonomous','robotics','AI'],
  true, now()
)
on conflict (slug) do nothing;

-- Achievements timeline ------------------------------------------------------
insert into achievements (title, happened_on, description, sort_order)
select 'Club Founded', date '2020-01-01', 'Cretus is founded as the Robotics & Automation Club of PDEU.', 1
where not exists (select 1 from achievements where title = 'Club Founded');
insert into achievements (title, happened_on, description, sort_order)
select 'First Robotics Workshop', date '2021-09-15', 'Introductory hands-on workshop on Arduino and sensors.', 2
where not exists (select 1 from achievements where title = 'First Robotics Workshop');
insert into achievements (title, happened_on, description, sort_order)
select 'Chess Robot - Prototype', date '2024-03-10', 'First working prototype of the autonomous chess-playing robot.', 3
where not exists (select 1 from achievements where title = 'Chess Robot - Prototype');

-- Sample events --------------------------------------------------------------
insert into events (title, slug, type, description_md, location, starts_at, registration_open, capacity, published)
values (
  'Intro to Robotics Workshop',
  'intro-to-robotics-workshop',
  'workshop',
  $md$A beginner-friendly, hands-on session covering microcontrollers, sensors, and actuators. No experience required - just curiosity.$md$,
  'PDEU, Raisan, Gandhinagar',
  now() + interval '21 days',
  true, 60, true
)
on conflict (slug) do nothing;

insert into events (title, slug, type, description_md, location, starts_at, registration_open, capacity, published)
values (
  'Cretus RoboWars 2026',
  'cretus-robowars-2026',
  'competition',
  $md$The flagship robotics competition. Build a combat bot and battle it out. Teams of up to 4.$md$,
  'PDEU Main Auditorium',
  now() + interval '45 days',
  true, 32, true
)
on conflict (slug) do nothing;

-- Inventory sample components -----------------------------------------------
insert into components (name, category, description, storage_location)
select 'Arduino Uno R3', 'Microcontroller', 'ATmega328P dev board', 'Cabinet A - Shelf 1'
where not exists (select 1 from components where name = 'Arduino Uno R3');
insert into components (name, category, description, storage_location)
select 'SG90 Servo Motor', 'Actuator', '9g micro servo', 'Cabinet A - Shelf 2'
where not exists (select 1 from components where name = 'SG90 Servo Motor');
insert into components (name, category, description, storage_location)
select 'HC-SR04 Ultrasonic', 'Sensor', 'Distance sensor', 'Cabinet B - Bin 3'
where not exists (select 1 from components where name = 'HC-SR04 Ultrasonic');
insert into components (name, category, description, storage_location)
select 'NEMA 17 Stepper', 'Actuator', 'Bipolar stepper motor', 'Cabinet B - Shelf 1'
where not exists (select 1 from components where name = 'NEMA 17 Stepper');
insert into components (name, category, description, storage_location)
select 'Jumper Wires (M-M)', 'Consumable', 'Pack of 40', 'Drawer 2'
where not exists (select 1 from components where name = 'Jumper Wires (M-M)');

-- Give a couple components some acquired stock so the dashboard isn't empty.
insert into acquisitions (component_id, quantity, unit_cost, total_cost, vendor, purchased_on, reason)
select c.id, 10, 450.00, 4500.00, 'Robu.in', current_date - 60, 'General club stock'
from components c
where c.name = 'Arduino Uno R3'
  and not exists (select 1 from acquisitions a where a.component_id = c.id);

insert into acquisitions (component_id, quantity, unit_cost, total_cost, vendor, purchased_on, reason)
select c.id, 25, 75.00, 1875.00, 'Robu.in', current_date - 60, 'General club stock'
from components c
where c.name = 'SG90 Servo Motor'
  and not exists (select 1 from acquisitions a where a.component_id = c.id);
