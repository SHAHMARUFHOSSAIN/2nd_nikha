<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Profile;
use App\Models\Interest;
use App\Models\MatchModel;
use App\Models\Conversation;
use App\Models\MembershipPlan;
use App\Models\Subscription;
use App\Models\Payment;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BusinessRulesTest extends TestCase {
    use RefreshDatabase;

    protected User $freeUser;
    protected User $premiumUser;
    protected User $targetUser;

    protected function setUp(): void {
        parent::setUp();

        $this->freeUser = User::factory()->create(['role' => 'FREE', 'gender' => 'Male']);
        Profile::factory()->create(['user_id' => $this->freeUser->id]);

        $this->premiumUser = User::factory()->create(['role' => 'PREMIUM', 'gender' => 'Male']);
        Profile::factory()->create(['user_id' => $this->premiumUser->id]);

        $this->targetUser = User::factory()->create(['role' => 'FREE', 'gender' => 'Female']);
        Profile::factory()->create(['user_id' => $this->targetUser->id]);
    }

    public function test_guest_cannot_send_interest() {
        $response = $this->postJson('/api/v1/interests', [
            'receiver_id' => $this->targetUser->id,
        ]);

        $response->assertStatus(401);
    }

    public function test_free_member_cannot_send_interest() {
        $response = $this->actingAs($this->freeUser)
            ->postJson('/api/v1/interests', [
                'receiver_id' => $this->targetUser->id,
            ]);

        $response->assertStatus(403)
            ->assertJsonPath('success', false);
    }

    public function test_premium_member_can_send_interest() {
        $response = $this->actingAs($this->premiumUser)
            ->postJson('/api/v1/interests', [
                'receiver_id' => $this->targetUser->id,
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('interests', [
            'sender_id' => $this->premiumUser->id,
            'receiver_id' => $this->targetUser->id,
            'status' => 'SENT',
        ]);
    }

    public function test_user_cannot_send_interest_to_self() {
        $response = $this->actingAs($this->premiumUser)
            ->postJson('/api/v1/interests', [
                'receiver_id' => $this->premiumUser->id,
            ]);

        $response->assertStatus(422);
    }

    public function test_duplicate_active_interest_is_blocked() {
        Interest::create([
            'sender_id' => $this->premiumUser->id,
            'receiver_id' => $this->targetUser->id,
            'status' => 'SENT',
        ]);

        $response = $this->actingAs($this->premiumUser)
            ->postJson('/api/v1/interests', [
                'receiver_id' => $this->targetUser->id,
            ]);

        $response->assertStatus(422);
    }

    public function test_accepting_interest_creates_match_and_conversation_atomically() {
        $interest = Interest::create([
            'sender_id' => $this->premiumUser->id,
            'receiver_id' => $this->targetUser->id,
            'status' => 'SENT',
        ]);

        $response = $this->actingAs($this->targetUser)
            ->postJson("/api/v1/interests/{$interest->id}/accept");

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('interests', [
            'id' => $interest->id,
            'status' => 'ACCEPTED',
        ]);

        $this->assertDatabaseHas('matches', [
            'status' => 'ACTIVE',
        ]);

        $this->assertDatabaseHas('conversations', [
            'status' => 'ACTIVE',
        ]);
    }

    public function test_non_participant_cannot_access_conversation_messages() {
        $match = MatchModel::create([
            'user_one_id' => $this->premiumUser->id,
            'user_two_id' => $this->targetUser->id,
            'status' => 'ACTIVE',
        ]);

        $conversation = Conversation::create([
            'match_id' => $match->id,
            'status' => 'ACTIVE',
        ]);

        $conversation->participants()->attach([
            $this->premiumUser->id => ['joined_at' => now()],
            $this->targetUser->id => ['joined_at' => now()],
        ]);

        $outsider = User::factory()->create();

        $response = $this->actingAs($outsider)
            ->getJson("/api/v1/conversations/{$conversation->id}/messages");

        $response->assertStatus(403);
    }
}
