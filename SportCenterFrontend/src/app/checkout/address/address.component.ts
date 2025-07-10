import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckoutComponent } from '../checkout/checkout.component';
import { Address } from '../../shared/interfaces/address';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss'
})
export class AddressComponent {
  addressForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private checkoutcomp: CheckoutComponent) {
    this.addressForm = this.formBuilder.group({
      Firstname: ['', [Validators.required]],
      Lastname: ['', [Validators.required]],
      Street: ['', [Validators.required]],
      City: ['', [Validators.required]],
      State: ['', [Validators.required]],
      ZipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]]
    })
  }

  onSubmit() {
    if (this.addressForm.valid) {
      const addressData: Address = this.addressForm.value;
      console.log("submitted Address:", addressData);
    }
  }

  goToNextStep() {
    if (this.addressForm.valid) {
      this.router.navigate(['/checkout/shipment']);
      this.checkoutcomp.setCurrentStep('shipment');
    }
  }
}
