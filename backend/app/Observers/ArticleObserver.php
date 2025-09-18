<?php

namespace App\Observers;
use App\Models\Article;
use Illuminate\Support\Facades\Storage;

class ArticleObserver
{
    /**
    * Handle the Article "deleted" event.
    */
    public function deleted(Article $article): void
    {
        // S'assurer que la relation est chargée
        $article->load('images');

        foreach ($article->images as $image) {
            // Convertir l'URL en chemin de stockage relatif
            $path = str_replace('/storage', 'public', $image->image_path);
        
            // Supprimer le fichier physique
            Storage::delete($path);
        
            // Supprimer l'enregistrement de l'image dans la base de données
            // Cela se fait en cascade normalement, mais on peut le forcer si besoin
            $image->delete();
        }
    }
}