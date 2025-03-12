<?php

namespace App\Controller;

use App\Entity\Customer;
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

        $username = $data['last_name'] ?? null;
        $password = $data['space_id'] ?? null;

        // Récupérer le client par son prénom
        $customer = $this->entityManager->getRepository(Customer::class)->findOneBy(['last_name' => $username]);


        if (!$customer || $customer->getSpaceId() !== $password) {
            return $this->json(['error' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
        }

        // 🔹 Retourne l'ID du client dans la réponse
        return $this->json([
            'message' => 'Login successful',
            'id' => $customer->getId()
        ]);
    }
}

