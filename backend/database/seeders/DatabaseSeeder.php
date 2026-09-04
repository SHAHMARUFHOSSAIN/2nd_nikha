<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Profile;
use App\Models\MembershipPlan;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder {
    public function run(): void {
        // Seed Membership Plans
        $plan = MembershipPlan::create([
            'name' => 'Premium Monthly',
            'slug' => 'premium-monthly',
            'price' => 1499.00,
            'currency' => 'BDT',
            'billing_interval' => 'MONTHLY',
            'is_active' => true,
            'features' => [
                'Unlimited Interest Sending',
                'Verified Member Badge',
                'Direct Contact Sharing',
                'Priority Search Placement',
            ],
        ]);

        // Seed Super Admin User
        $admin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@2ndchance.com',
            'phone' => '+8801700000000',
            'gender' => 'Male',
            'password' => Hash::make('AdminSecret123!'),
            'role' => 'ADMIN',
            'status' => 'ACTIVE',
            'email_verified_at' => now(),
        ]);

        Profile::create([
            'user_id' => $admin->id,
            'date_of_birth' => '1988-03-10',
            'religion' => 'Islam',
            'city' => 'Dhaka',
            'marital_status' => 'Divorced',
            'education' => 'MSc in Computer Science',
            'profession' => 'System Administrator',
            'about_me' => 'Super Admin account for platform oversight.',
        ]);

        // Seed Fictional Development Demo Users
        $demoUser1 = User::create([
            'name' => 'Anika Rahman',
            'email' => 'anika@example.com',
            'phone' => '+8801711111111',
            'gender' => 'Female',
            'password' => Hash::make('Secret123!'),
            'role' => 'PREMIUM',
            'status' => 'ACTIVE',
            'email_verified_at' => now(),
        ]);

        Profile::create([
            'user_id' => $demoUser1->id,
            'date_of_birth' => '1994-06-15',
            'religion' => 'Islam',
            'city' => 'Dhaka',
            'marital_status' => 'Divorced',
            'has_children' => true,
            'children_count' => 1,
            'education' => 'BSc in Software Engineering',
            'profession' => 'Senior Software Engineer',
            'verification_status' => 'Verified',
            'about_me' => 'Independent, family-oriented professional looking for a sincere partner.',
        ]);

        $demoUser2 = User::create([
            'name' => 'Tanvir Ahmed',
            'email' => 'tanvir@example.com',
            'phone' => '+8801722222222',
            'gender' => 'Male',
            'password' => Hash::make('Secret123!'),
            'role' => 'FREE',
            'status' => 'ACTIVE',
            'email_verified_at' => now(),
        ]);

        Profile::create([
            'user_id' => $demoUser2->id,
            'date_of_birth' => '1990-11-20',
            'religion' => 'Islam',
            'city' => 'Chittagong',
            'marital_status' => 'Widowed',
            'has_children' => false,
            'education' => 'MBA in Finance',
            'profession' => 'Bank Manager',
            'verification_status' => 'Verified',
            'about_me' => 'Looking for mutual respect, kindness, and a second chance at marriage.',
        ]);
    }
}
