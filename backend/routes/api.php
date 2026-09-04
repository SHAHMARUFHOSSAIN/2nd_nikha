<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\v1\AuthController;
use App\Http\Controllers\Api\v1\SearchController;
use App\Http\Controllers\Api\v1\InterestController;
use App\Http\Controllers\Api\v1\ConversationController;
use App\Http\Controllers\Api\v1\PaymentController;

/*
|--------------------------------------------------------------------------
| API Routes - Version 1 (/api/v1/*)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // Public Authentication Routes
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // SSLCommerz Public IPN and Callbacks
    Route::post('/payments/sslcommerz/ipn', [PaymentController::class, 'handleIPN']);
    Route::post('/payments/sslcommerz/success', [PaymentController::class, 'handleSuccess']);
    Route::post('/payments/sslcommerz/fail', [PaymentController::class, 'handleFail']);
    Route::post('/payments/sslcommerz/cancel', [PaymentController::class, 'handleCancel']);

    // Authenticated Sanctum Routes
    Route::middleware('auth:sanctum')->group(function () {
        
        // Auth User Profile & Logout
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Profile Search
        Route::get('/search', [SearchController::class, 'search']);

        // Interests API
        Route::post('/interests', [InterestController::class, 'send']);
        Route::get('/interests/received', [InterestController::class, 'received']);
        Route::get('/interests/sent', [InterestController::class, 'sent']);
        Route::post('/interests/{id}/accept', [InterestController::class, 'accept']);
        Route::post('/interests/{id}/reject', [InterestController::class, 'reject']);

        // Conversations & Messages API
        Route::get('/conversations', [ConversationController::class, 'index']);
        Route::get('/conversations/{id}/messages', [ConversationController::class, 'messages']);
        Route::post('/conversations/{id}/messages', [ConversationController::class, 'sendMessage']);
        Route::post('/conversations/{id}/contacts', [ConversationController::class, 'shareContact']);

        // Payments API
        Route::post('/payments/sslcommerz/initiate', [PaymentController::class, 'initiateSSLCommerz']);
    });

});
