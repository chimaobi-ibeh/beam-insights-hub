-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- Update is_editor function to check both admin and editor roles
CREATE OR REPLACE FUNCTION public.is_editor()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')
$$;

-- RLS policies for user_roles table
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.is_admin());

CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Add policy for profiles: admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.is_admin());

-- Add policy for profiles: admins can update all profiles
CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
USING (public.is_admin());