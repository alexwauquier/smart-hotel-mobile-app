<?php

// src/Controller/AuthController.php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class AuthController
{
    private $passwordHasher;
    private $entityManager;

    // Injecter les dépendances
    public function __construct(UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager)
    {
        $this->passwordHasher = $passwordHasher;
        $this->entityManager = $entityManager;
    }

    #[Route('/api/users/login', name: 'login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        // Décoder le JSON envoyé dans la requête
        $data = json_decode($request->getContent(), true);

        // Vérifier les données reçues
        $username = $data['username'] ?? null;
        $password = $data['password'] ?? null;

        if (!$username || !$password) {
            return new JsonResponse(['message' => 'Username and password are required'], 400);
        }

        // Récupérer l'utilisateur depuis la base de données
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['username' => $username]);

        if (!$user) {
            return new JsonResponse(['message' => 'Invalid username or password'], 401);
        }

        // Vérifier le mot de passe avec le nouvel hasher
        if ($this->passwordHasher->isPasswordValid($user, $password)) {
            return new JsonResponse(['message' => 'Login successful']);
        }

        return new JsonResponse(['message' => 'Invalid username or password'], 401);
    }
}
