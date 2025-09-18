<?php
// database/seeders/CategorySeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $names = [
            'Mode & accessoires',
            'Bijoux & joaillerie',
            'Maison & décoration',
            'Mobilier & ameublement',
            'Vannerie & fibres',
            'Art & œuvres',
            'Instruments & musique',
            'Jouets & jeux',
            'Cuisine & ustensiles',
            'Cosmétique & bien-être',
            'Épicerie artisanale (non frais)',
            'Tissus & teintures',
        ];

        $created = 0; $skipped = 0;

        foreach ($names as $name) {
            $cat = Category::firstOrCreate(
                ['name' => $name, 'admin_id' => 1],
                [] // aucun autre champ
            );
            $cat->wasRecentlyCreated ? $created++ : $skipped++;
        }

        $this->command?->info("Catégories: +{$created} créées, {$skipped} déjà présentes (admin_id=1).");
    }
}
