<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', $user::class));
        }

        $user->setPassword($newHashedPassword);
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }

    /**
     * Trouver un utilisateur par son nom de famille.
     */
    public function findByLastName(string $lastName): ?User
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.lastname = :lastName')  // Recherche par lastname
            ->setParameter('lastName', $lastName)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Trouver les clients actuellement présents à l'hôtel (entre checkInDate et checkOutDate).
     */
    public function findCurrentGuests(): array
    {
        return $this->createQueryBuilder('u')
            ->andWhere(':today BETWEEN u.checkInDate AND u.checkOutDate')
            ->setParameter('today', new \DateTimeImmutable())
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouver les clients ayant une réservation future.
     */
    public function findFutureGuests(): array
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.checkInDate > :today')
            ->setParameter('today', new \DateTimeImmutable())
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouver les clients ayant une réservation passée.
     */
    public function findPastGuests(): array
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.checkOutDate < :today')
            ->setParameter('today', new \DateTimeImmutable())
            ->getQuery()
            ->getResult();
    }
}
