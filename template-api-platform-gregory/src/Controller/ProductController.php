<?php

namespace App\Controller;

use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ProductController extends AbstractController
{
    #[Route('/api/products', name: 'api_products', methods: ['GET'])] 
    public function getAllProducts(ProductRepository $productRepository): JsonResponse
    {
        // Récupère toutes les boissons depuis la base de données
        $products = $productRepository->findAll();

        // Si des produits sont trouvés, on les retourne sous forme de tableau associatif
        $productData = [];
        foreach ($products as $product) {
            $productData[] = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'description' => $product->getDescription(),
                'ingredients' => $product->getIngredients(),
                'type_id' => $product->getTypeId(),
                'unit_price' => $product->getUnitPrice(),
                'stock_quantity' => $product->getStockQuantity(),
                'limit_quantity' => $product->getLimitQuantity(),
                'contains_alcohol' => $product->containsAlcohol(),
            ];
        }

        return $this->json($productData);
    }

    // Nouvelle méthode pour récupérer un produit par son ID
    #[Route('/api/products/{id}', name: 'api_product_by_id', methods: ['GET'])]
    public function getProductById(int $id, ProductRepository $productRepository): JsonResponse
    {
        // Récupère un produit en fonction de l'ID
        $product = $productRepository->find($id);

        if (!$product) {
            return $this->json(['error' => 'Produit non trouvé'], 404);
        }

        // Retourne les informations du produit sous forme de tableau associatif
        return $this->json([
            'id' => $product->getId(),
            'name' => $product->getName(),
            'description' => $product->getDescription(),
            'ingredients' => $product->getIngredients(),
            'type_id' => $product->getTypeId(),
            'unit_price' => $product->getUnitPrice(),
            'stock_quantity' => $product->getStockQuantity(),
            'limit_quantity' => $product->getLimitQuantity(),
            'contains_alcohol' => $product->containsAlcohol(),
        ]);
    }
}

?>