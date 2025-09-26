<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StatisticsApiTest extends TestCase
{
    use RefreshDatabase;

    private User $adminUser;
    private User $regularUser;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test users
        $this->adminUser = User::factory()->create(['role' => 'admin']);
        $this->regularUser = User::factory()->create(['role' => 'user']);
    }

    public function test_statistics_dashboard_requires_admin_role()
    {
        // Test unauthenticated access
        $response = $this->getJson('/api/admin/statistics/dashboard');
        $response->assertStatus(401);

        // Test regular user access
        $response = $this->actingAs($this->regularUser)
            ->getJson('/api/admin/statistics/dashboard');
        $response->assertStatus(403);

        // Test admin user access
        $response = $this->actingAs($this->adminUser)
            ->getJson('/api/admin/statistics/dashboard');
        $response->assertStatus(200);
    }

    public function test_statistics_overview_returns_correct_structure()
    {
        $response = $this->actingAs($this->adminUser)
            ->getJson('/api/admin/statistics/overview');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'code',
                'status',
                'message',
                'data' => [
                    'users' => [
                        'total',
                        'admins',
                        'regular_users',
                        'new_this_month'
                    ],
                    'products' => [
                        'total',
                        'categories',
                        'average_price'
                    ],
                    'orders' => [
                        'total',
                        'pending',
                        'processing',
                        'shipped',
                        'delivered',
                        'cancelled',
                        'this_month'
                    ],
                    'revenue' => [
                        'total',
                        'this_month',
                        'this_year',
                        'average_order_value'
                    ],
                    'carts' => [
                        'active_carts',
                        'total_items',
                        'abandoned_value'
                    ]
                ]
            ]);
    }

    public function test_all_statistics_endpoints_require_admin_role()
    {
        $endpoints = [
            '/api/admin/statistics/overview',
            '/api/admin/statistics/dashboard',
            '/api/admin/statistics/users',
            '/api/admin/statistics/products',
            '/api/admin/statistics/orders',
            '/api/admin/statistics/revenue',
        ];

        foreach ($endpoints as $endpoint) {
            // Test unauthenticated access
            $response = $this->getJson($endpoint);
            $response->assertStatus(401);

            // Test regular user access
            $response = $this->actingAs($this->regularUser)
                ->getJson($endpoint);
            $response->assertStatus(403);

            // Test admin user access
            $response = $this->actingAs($this->adminUser)
                ->getJson($endpoint);
            $response->assertStatus(200);
        }
    }

    public function test_revenue_endpoint_accepts_date_parameters()
    {
        $response = $this->actingAs($this->adminUser)
            ->getJson('/api/admin/statistics/revenue?start_date=2024-01-01&end_date=2024-12-31');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'total_revenue',
                    'orders_count',
                    'average_order_value',
                    'daily_revenue',
                    'monthly_revenue',
                    'top_revenue_days'
                ]
            ]);
    }
}