import { Component } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {

  currentStep: 'address' | 'shipment' | 'review' = 'address';

  setCurrentStep(step: 'address' | 'shipment' | 'review') {
    this.currentStep = step;
  }

}
