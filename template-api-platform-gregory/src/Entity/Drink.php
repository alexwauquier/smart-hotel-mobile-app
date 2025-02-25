<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ApiResource]  // Expose l'entité en API
class Drink
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: 'text')]
    private ?string $ingredients = null;

    #[ORM\Column(type: 'float')]
    private ?float $price = null;

    #[ORM\Column(type: 'boolean')]
    private ?bool $isAlcoholic = null;

    // ✅ GETTER et SETTER pour chaque propriété

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getIngredients(): ?string
    {
        return $this->ingredients;
    }

    public function setIngredients(string $ingredients): self
    {
        $this->ingredients = $ingredients;
        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): self
    {
        $this->price = $price;
        return $this;
    }

    public function isAlcoholic(): ?bool
    {
        return $this->isAlcoholic;
    }

    public function setIsAlcoholic(bool $isAlcoholic): self
    {
        $this->isAlcoholic = $isAlcoholic;
        return $this;
    }
}
