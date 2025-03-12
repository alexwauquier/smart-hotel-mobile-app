<?php 

namespace App\Controller;

use App\Repository\CustomerRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{
    #[Route('/api/customers/{id}', name: 'api_customer', methods: ['GET'])]
    public function getCustomer($id, CustomerRepository $customerRepository): JsonResponse
    {
        // Récupérer le client par ID
        $customer = $customerRepository->find($id);

        if (!$customer) {
            return $this->json(['error' => 'Utilisateur non trouvé'], 404);
        }

        // Retourner les données du client
        return $this->json([
            'id' => $customer->getId(),
            'firstName' => $customer->getFirstName(),
            'lastName' => $customer->getLastName(),
            'arrivalDate' => $customer->getArrivalDate()->format('Y-m-d H:i'),
            'departureDate' => $customer->getDepartureDate()->format('Y-m-d H:i'),
        ]);
    }
}

?>