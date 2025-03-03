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

        // Récupérer l'utilisateur par son lastname
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['lastname' => $username]);

        if (!$user || $user->getRoomNumber() !== $password) {
            return $this->json(['error' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
        }

        // 🔹 Retourne l'ID dans la réponse
        return $this->json([
            'message' => 'Login successful',
            'id' => $user->getId() // ✅ Ajout de l'ID dans la réponse
        ]);
    }
}

?>