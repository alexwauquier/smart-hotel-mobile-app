<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_LASTNAME', fields: ['lastname'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private ?string $firstname = null;

    #[ORM\Column(length: 100, unique: true)]
    private ?string $lastname = null;

    #[ORM\Column(length: 10)]
    private ?string $roomNumber = null; // Utilisé comme mot de passe

    #[ORM\Column]
    private array $roles = [];

    #[ORM\Column(type: "datetime_immutable")]
    private ?\DateTimeImmutable $checkInDate = null;

    #[ORM\Column(type: "datetime_immutable")]
    private ?\DateTimeImmutable $checkOutDate = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): static
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): static
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getRoomNumber(): ?string
    {
        return $this->roomNumber;
    }

    public function setRoomNumber(string $roomNumber): static
    {
        $this->roomNumber = $roomNumber;

        return $this;
    }

    /**
     * Identifiant unique pour la connexion.
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->lastname;
    }

    /**
     * Retourne le "mot de passe" (numéro de chambre).
     */
    public function getPassword(): string
    {
        return $this->roomNumber;
    }

    public function setPassword(string $password): static
    {
        $this->roomNumber = $password;

        return $this;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    public function eraseCredentials(): void
    {
        // Aucune donnée sensible à nettoyer ici
    }

    public function getCheckInDate(): ?\DateTimeImmutable
    {
        return $this->checkInDate;
    }

    public function setCheckInDate(\DateTimeImmutable $checkInDate): static
    {
        $this->checkInDate = $checkInDate;

        return $this;
    }

    public function getCheckOutDate(): ?\DateTimeImmutable
    {
        return $this->checkOutDate;
    }

    public function setCheckOutDate(\DateTimeImmutable $checkOutDate): static
    {
        $this->checkOutDate = $checkOutDate;

        return $this;
    }
}
