import { Component, OnInit } from '@angular/core';
import { DeliveryOptions } from '../../shared/interfaces/deliveryOptions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasketService } from '../../basket/basket.service';
import { Router } from '@angular/router';
import { CheckoutComponent } from '../checkout/checkout.component';

@Component({
  selector: 'app-shipment',
  templateUrl: './shipment.component.html',
  styleUrl: './shipment.component.scss'
})
export class ShipmentComponent implements OnInit {

  deliveryOptions: DeliveryOptions[] = [
    { id: 1, name: 'Fedex', description: 'Fast delivery', deliveryTime: '2-3 days', price: 50 },
    { id: 2, name: 'DTDC', description: 'Most Free delivery', deliveryTime: '3 days', price: 40 },
    { id: 3, name: 'First flight', description: 'Economic delivery', deliveryTime: '4 days', price: 20 },
    { id: 4, name: 'Normal', description: 'Standard delivery', deliveryTime: '1 Week', price: 10 },
  ];

  shipmentForm: FormGroup;

  constructor(
    private basketService: BasketService,
    private formBuilder: FormBuilder,
    private router: Router,
    private checkoutComponent: CheckoutComponent
  ) {
    // Initialize the form with a default value directly
    this.shipmentForm = this.formBuilder.group({
      selectedOption: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    // Set the initial value and update the price after the component initializes
    if (this.deliveryOptions.length > 0) {
      this.shipmentForm.get('selectedOption')?.setValue(this.deliveryOptions[0].id);
      this.updateShipmentPrice();
    }
  }


  updateShipmentPrice() {
    // Get the value from the form control, not the component property
    const selectedId = this.shipmentForm.get('selectedOption')?.value;
    const selectedDeliveryOptrion = this.deliveryOptions.find(
      option => option.id === selectedId);

    if (selectedDeliveryOptrion) {
      this.basketService.updateShippingPrice(selectedDeliveryOptrion.price);
    }
  }

  goToNextStep() {
    console.log(this.shipmentForm.valid);
    if (this.shipmentForm.valid) {
      this.updateShipmentPrice();
      this.router.navigate(['/checkout/review']);
      this.checkoutComponent.setCurrentStep('review');
    }
  }
}
