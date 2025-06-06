/*
  # Add Mental Quality Fields to Session Reflections

  1. New Fields
    - game_level_self_rating (text): A/B/C/D game rating
    - non_a_game_reasons (text[]): Array of reasons for not playing A-game
    - rescue_attempted (boolean): Whether user tried to recover to A-game
    - rescue_strategy (text): Strategy used to attempt recovery
    - c_game_moment_note (text): Description of a critical mental mistake

  2. Changes
    - Adds CHECK constraint for game level rating
    - All fields are nullable to maintain backward compatibility
*/

ALTER TABLE session_reflections
ADD COLUMN game_level_self_rating text CHECK (game_level_self_rating IN ('a', 'b', 'c', 'd')),
ADD COLUMN non_a_game_reasons text[],
ADD COLUMN rescue_attempted boolean,
ADD COLUMN rescue_strategy text,
ADD COLUMN c_game_moment_note text;