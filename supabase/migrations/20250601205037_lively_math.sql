/*
  # Create goats table and set up security policies

  1. New Tables
    - `goats`
      - `id` (uuid, primary key)
      - `owner_name` (text)
      - `price` (numeric)
      - `payment_status` (text)
      - `paid_amount` (numeric)
      - `remaining_amount` (numeric)
      - `created_at` (timestamptz)
      - `notes` (text, nullable)

  2. Security
    - Enable RLS on `goats` table
    - Add policies for CRUD operations
*/

-- Create the goats table
CREATE TABLE IF NOT EXISTS public.goats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_name text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  payment_status text NOT NULL CHECK (payment_status IN ('paid', 'partial', 'unpaid')),
  paid_amount numeric NOT NULL DEFAULT 0 CHECK (paid_amount >= 0),
  remaining_amount numeric NOT NULL DEFAULT 0 CHECK (remaining_amount >= 0),
  created_at timestamptz DEFAULT now(),
  notes text
);

-- Enable Row Level Security
ALTER TABLE public.goats ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Enable read access for authenticated users"
  ON public.goats
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON public.goats
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON public.goats
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
  ON public.goats
  FOR DELETE
  TO authenticated
  USING (true);