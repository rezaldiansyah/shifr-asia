<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'admin:create 
                            {email : The email address for the admin}
                            {--name= : The name for the admin}
                            {--password= : The password (will be prompted if not provided)}';

    /**
     * The console command description.
     */
    protected $description = 'Create a new admin user or upgrade existing user to admin';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = $this->argument('email');
        $name = $this->option('name') ?? 'Admin';
        $password = $this->option('password');

        // Check if user already exists
        $existingUser = User::where('email', $email)->first();

        if ($existingUser) {
            if ($existingUser->role === 'admin') {
                $this->info("User {$email} is already an admin.");
                return Command::SUCCESS;
            }

            if ($this->confirm("User {$email} exists. Upgrade to admin?", true)) {
                $existingUser->role = 'admin';
                $existingUser->save();
                $this->info("✅ User {$email} upgraded to admin successfully!");
                return Command::SUCCESS;
            }

            return Command::FAILURE;
        }

        // Create new admin user
        if (!$password) {
            $password = $this->secret('Enter password for the admin');
            if (!$password) {
                $this->error('Password is required.');
                return Command::FAILURE;
            }
        }

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        $this->info("✅ Admin user created successfully!");
        $this->table(
            ['ID', 'Name', 'Email', 'Role'],
            [[$user->id, $user->name, $user->email, $user->role]]
        );

        return Command::SUCCESS;
    }
}
