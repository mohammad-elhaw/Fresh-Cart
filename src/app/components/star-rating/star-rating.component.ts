import { NgStyle } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss'
})
export class StarRatingComponent implements OnInit {

  @Input() rating!:number;
  fullStars!:number[];
  halfStar!:number;
  emptyStars!:number[];
  halfStarGradient!:string;

  private colors ={
    "text-gray-300": "#d1d5db",
    "rating-color" : "#ffc908" 
  }

  ngOnInit(): void {
    this.calculateStars();
  }

  calculateStars():void{
    const countRating = Math.floor(this.rating);
    const hasHalfStar = this.rating % 1 !== 0;
    this.fullStars = Array(countRating).fill(0);
    this.halfStar = (hasHalfStar ? (this.rating % 1) : 0);
    this.emptyStars = Array(5 - countRating - (hasHalfStar ? 1 : 0)).fill(0);
    
    if(this.halfStar){
      const filledPercentage = this.halfStar * 100;
      const unFilledPercentage = 100 - filledPercentage;
      const filledColor = this.colors['rating-color'];
      const emptyColor = this.colors['text-gray-300'];
      this.halfStarGradient = `linear-gradient(to right,  ${filledColor} ${filledPercentage}%, ${emptyColor} ${unFilledPercentage}%)`;
    }
  }
}

