<?php

namespace App\Http\Controllers\Api\Artisan;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Authorization\AuthorizationException;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Log;

class ArticleController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource for the authenticated artisan.
     */
    public function index(): JsonResponse
    {
        $artisan = Auth::user()->artisan;
        $articles = $artisan->articles()->with('images', 'category')->latest()->get();
        return response()->json($articles);
    }

    /**
    * Store a newly created resource in storage.
    */
    public function store(StoreArticleRequest $request): JsonResponse
    {
        $artisan = Auth::user()->artisan;
        $data = $request->validated();
        $article = $artisan->articles()->create([
            'name' => $data['name'],
            'description' => $data['description'],
            'price' => $data['price'],
            'stock' => $data['stock'],
            'category_id' => $data['category_id'],
            'materials' => $data['materials'],
            'dimensions' => $data['dimensions'],
            'weight' => $data['weight'],
        ]);

        if ($request->has('images')) {
            Log::info($request->file('images'));
            foreach ($request->file('images') as $imageFile) {
                $fileName = time() . '_' . uniqid() . '_' . $imageFile->getClientOriginalExtension();
                $path = $imageFile->move(public_path('uploads'), $fileName);
                $article->images()->create(['image_path' => asset('uploads/' . $fileName)]);
            }
        }

        return response()->json($article->load('images', 'category'), 201);
    }

    /**
    * Update the specified resource in storage.
    */
    public function update(UpdateArticleRequest $request, Article $article): JsonResponse
    {
        $this->authorize('manage', $article);

        $data = $request->validated();
    
        $article->update([
            'name' => $data['name'],
            'description' => $data['description'],
            'price' => $data['price'],
            'stock' => $data['stock'],
            'category_id' => $data['category_id'],
            'materials' => $data['materials'],
            'dimensions' => $data['dimensions'],
            'weight' => $data['weight'],
        ]);

        if ($request->hasFile('images')) {
         // Supprimer les anciennes images
        foreach ($article->images as $image) {
            $path = str_replace('/storage', 'public', $image->image_path);
            Storage::delete($path);
            $image->delete();
        }

        // Ajouter les nouvelles images
        foreach ($request->file('images') as $imageFile) {
            $path = $imageFile->store('public/articles');
            $article->images()->create(['image_path' => Storage::url($path)]);
        }
    }

        return response()->json($article->load('images', 'category'));
    }

    /**
    * Publish an article.
    */
    public function publish(Article $article): JsonResponse
    {
        Gate::authorize('manage', $article);
        //$this->authorize('manage', $article);

        if ($article->status === 'published') {
            return response()->json(['message' => 'Cet article est déjà publié.'], 400);
        }

        $article->update([
            'status' => 'published',
            'published_at' => now(),
        ]);

        return response()->json($article->load('images', 'category'));
    }

    /**
    * Remove the specified resource from storage.
    */
    public function destroy(Article $article): JsonResponse
    {
        $this->authorize('manage', $article);
        $article->delete(); // L'observer s'occupera de la suppression des fichiers
        return response()->json(['message' => 'Article supprimé avec succès.'], 200);
    }
}