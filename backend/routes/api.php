<?php

// Routes for authentication
require __DIR__ . '/api/auth.php';

// Admin API routes (require admin privileges)
require __DIR__ . '/api/admin.php';

// Private API routes (require authentication)
require __DIR__ . '/api/private.php';

// Public API routes (no authentication required)
require __DIR__ . '/api/public.php';