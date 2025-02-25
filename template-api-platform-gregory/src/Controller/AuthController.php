<?php

// src/Controller/AuthController.php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AuthController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/login', name: 'app_login', methods: ['POST'])]
    public function login(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);

        $username = $data['lastname'] ?? null;
        $password = $data['roomNumber'] ?? null;

        // Utilise EntityManagerInterface pour accéder au repository de User
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['lastname' => $username]);

        if (!$user || $user->getRoomNumber() !== $password) {
            return $this->json(['error' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
        }

        // Connexion réussie
        return $this->json(['message' => 'Login successful']);
    }
}

?>