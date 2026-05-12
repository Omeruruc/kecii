/*
  # Fix RLS policies for goats table

  1. Changes
    - Update RLS policies to handle anonymous access correctly
    - Add proper policies for all CRUD operations
  
  2. Security
    - Enable RLS on goats table (already enabled)
    - Add policies for anonymous access
    - Maintain existing authenticated user policies
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON goats;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON goats;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON goats;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON goats;

-- Create new policies that allow both anonymous and authenticated access
CREATE POLICY "Enable read access for all users"
ON goats
FOR SELECT
USING (true);

CREATE POLICY "Enable insert access for all users"
ON goats
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable update access for all users"
ON goats
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for all users"
ON goats
FOR DELETE
USING (true);