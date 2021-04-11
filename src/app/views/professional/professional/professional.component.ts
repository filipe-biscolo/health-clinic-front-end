import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { LoginService } from 'src/app/shared/services/login.service';
import { City, State } from 'src/app/shared/model/address';
import { AddressService } from 'src/app/shared/services/address.service';
import { HealthInsuranceService } from '../../../shared/services/health-insurance.service';
import { ProfessionalService } from '../../../shared/services/professional.service';

import * as arrPerson from '../../../shared/arrays/person';
import { FormValidations } from 'src/app/shared/functions/form-validations';
import { map } from 'rxjs/operators';
import { OccupationService } from '../../../shared/services/occupation.service';
import { Permissions } from './../../../shared/enums/permissions';

@Component({
  selector: 'app-professional',
  templateUrl: './professional.component.html',
  styleUrls: ['./professional.component.scss']
})
export class ProfessionalComponent implements OnInit {
  private idClinic = this.loginService.getIdClinic();
  public idProfessional = this.loginService.getIdProfessional();
  public admin = this.loginService.getAdmin();
  public permissions = this.loginService.getPermissions();
  form: FormGroup;
  formUser: FormGroup;
  
  items: MenuItem[] = [ { label: 'Profissionais', routerLink: '/professionals' }, { label: 'Novo profissional' } ];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/schedule' };

  arrStates: State[];
  arrCities: City[];

  titlePage = 'Novo profissional';

  listPermissions = Permissions;

  sex = arrPerson.Sex;
  marital_status = arrPerson.MaritalStatus;
  healthInsurances: any[];
  occupations: any[];
  
  phoneMask = '(00) 0000-00009';
  phoneMaskAux = '(00) 0000-00009';

  cols: any[];
  professionalHIs: any[];
  page = 0;
  totalRecords = 0;
  rowsPerPageOptions = [5, 10, 20];
  rows = this.rowsPerPageOptions[0];
  first = 0;

  health_insurance_id = null;

  load = false;
  loadForm = false;
  loadHI = false;

  loadTableHi = false;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private professionalService: ProfessionalService,
    private addressService: AddressService,
    private occupationService: OccupationService,
    private healthInsuranceService: HealthInsuranceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
  ) { }

    ngOnInit(): void {
      this.cols = [{ field: 'name', header: 'Nome' }];
      this.form = this.formBuilder.group({
        id: [null],
        clinic_id: [null],
        occupation_id: [null, [Validators.required]],
        admin: [false],
        note: [null],
        user: this.formBuilder.group({
          email: [null, [Validators.email]],
          password: [null],
			    conf_password: [null],
			    clinic_id: [null],
        }),
        person: this.formBuilder.group({
          cpf: [null, [FormValidations.cpfValidator]],
          rg: [null, [Validators.maxLength(20)]],
          name: [null, [Validators.required, Validators.maxLength(200)]],
          phone: [null, [Validators.required]],
          phone_aux: [null],
          
          birth_date: [null],
          sex: [null],
          marital_status: [null],
          
          street: [null],
          district: [null],
          address_number: [null],
          city_id: [null],
          state_id: [null],
          cep: [null]
        }),
        health_insurances: [null]
      });
      this.form.get('person.birth_date').setValue('2000-01-01');
      this.form.get('user.email').disable();
     
      this.formUser = this.formBuilder.group({
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(6)]],
        conf_password: [null, [Validators.required]]
      },
      {
         validator: FormValidations.passwordMatchValidatorProfessional
      });
      
      const id = this.activatedRoute.snapshot.params.id as string;
      if (!!id) {
        this.loadForm = true;
        this.professionalService.getProfessionalById(this.idClinic, id).subscribe(
          professional => {
            this.titlePage = 'Editar profissional';
            this.items = [ { label: 'Profissionais', routerLink: '/professionals' }, { label: 'Editar profissional' } ]
            this.listProfessionalHIs(professional.id);
            this.form.patchValue({
              ...professional
            });
            this.loadForm = false;
          },
          error => {
            this.loadForm = false;
            this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao carregar profissional'});
          }
        );
      }
  
      this.getStates();
      this.getHI();
      this.getOccupations();
  
      this.form.get('person.state_id').valueChanges
          .pipe(map(idState => idState > 0 ? idState : null ))
          .subscribe(response => this.getCities(response));
  
      this.form.get('person.phone').valueChanges
        .pipe(map(phone => phone && phone.length === 11 ? '(00) 00000-0009' : '(00) 0000-00009' ))
        .subscribe(response => this.phoneMask = response);
  
      this.form.get('person.phone_aux').valueChanges
        .pipe(map(phone => phone && phone.length === 11 ? '(00) 00000-0009' : '(00) 0000-00009' ))
        .subscribe(response => this.phoneMaskAux = response);      
      }

      createItem(): FormGroup {
        return this.formBuilder.group({
          health_insurance_id: '',
        });
      }

      verifyValidTouched(input: string) {
        return !this.form.get(input).valid && (this.form.get(input).touched || this.form.get(input).dirty);
      }
    
      applyInputError(input) {
        return {
          'ng-invalid ng-dirty': this.verifyValidTouched(input)
        };
      }

      verifyUserValidTouched(input: string) {
        return !this.formUser.get(input).valid && (this.formUser.get(input).touched || this.formUser.get(input).dirty);
      }
    
      applyUserInputError(input) {
        return {
          'ng-invalid ng-dirty': this.verifyUserValidTouched(input)
        };
      }
    
      onSubmit() {
        if (!this.form.valid) {
          FormValidations.verifyValidationsForm(this.form);
          !this.form.get('id').value && FormValidations.verifyValidationsForm(this.formUser);
          return;
        }

        if (!this.formUser.valid && !this.form.get('id').value) {
          FormValidations.verifyValidationsForm(this.formUser);
          return;
        }        
    
        const values = this.form.value;
        this.load = true;
        if(values.id) {
          this.professionalService.putProfessional(values).subscribe(
            (response) => {
              this.load = false;
              this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Profissional atualizado!' });
              this.router.navigate(['/professionals']);
            },
            (error) => {
              this.load = false;
              this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao atualizar profissional'});
            }
          );
        } else {
          values.clinic_id = this.idClinic;
          values.user.clinic_id = this.idClinic;
          values.user.email = this.formUser.get('email').value;
          values.user.password = this.formUser.get('password').value;
          values.user.conf_password = this.formUser.get('conf_password').value;
          this.professionalService.postProfessional(values).subscribe(
            (response) => {
              this.load = false;
              this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Profissional criado!' });
              this.router.navigate(['/professionals']);
            },
            (error) => {
              this.load = false;
              if(error.status === 409) {
                this.messageService.add({severity:'error', summary: 'Erro', detail: 'Já existe um usuário com esse e-mail!'});
              } else {
                this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao criar profissional'});
              }
            }
          );
        }
      }
    
      getHI() {
        this.healthInsuranceService.getHealthInsurancesAll(this.idClinic).subscribe(
          response => {
            this.healthInsurances = response;
          },
          error => { console.error(error); }
        )
      }
    
      getStates() {
        this.addressService.getStates().subscribe(
            response => {
              this.arrStates = response;
            },
            error => console.error(error)
            );
      }
    
      getCities(idState: number) {
          this.addressService.getCitiesByStateId(idState).subscribe(
            response => {
              this.arrCities = response;
            },
            error => { console.error(error); }
          );
      }

      getOccupations() {
        this.occupationService.getOccupationsAll(this.idClinic).subscribe(
            response => {
              this.occupations = response;
            },
            error => console.error(error)
            );
      }
    
      cancel() {
        this.router.navigate(['/professionals']);
      }

      submitHI() {
        if(!this.health_insurance_id){
          return;
        }
        
        const values = this.form.value;
        this.loadHI = true;
        if(this.form.get('id').value) {
          this.professionalService.postProfessionalHI(values, this.health_insurance_id).subscribe(
            (response) => {
              this.health_insurance_id = null;
              this.loadHI = false;
              this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Convênio adicionado!' });
              this.refresh();
            },
            (error) => {
              this.loadHI = false;
              if(error.status === 409) {
                this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Convênio já cadastrado para esse profissional!'});
              } else {
                this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao adicionar convênio'});
              }
            }
          );
        } else {
          let array: any = this.form.get('health_insurances').value;
          !array && (array = []);
          const exist = array.find(ex => ex.health_insurance_id === this.health_insurance_id);
          if(!exist){
            this.loadHI = false;
            let hi = this.healthInsurances.find(hi => hi.id === this.health_insurance_id);
            array.push({health_insurance_id: this.health_insurance_id, name: hi.name});
            this.form.get('health_insurances').setValue(array);
            this.health_insurance_id = null;
          } else {
            this.loadHI = false;
            this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Convênio já adicionado!'});
          }
        }
      }

      listProfessionalHIs(idProfessional){
        this.loadTableHi = true;
        this.professionalService.getProfessionalHIs(idProfessional, this.page, this.rows).subscribe(
          response => {
            this.loadTableHi = false;
            this.professionalHIs = response.professionalHIs;
            this.totalRecords = response.totalCount;
        },
        error => {
          this.loadTableHi = false;
          this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao carregar convênios do profissional'});
        });
      }

      paginate(event) {
        this.page = event.page;
        this.rows = event.rows;
        this.first = event.first;
        this.listProfessionalHIs(this.form.get('id').value);
      }

      refresh(){
        this.first = 0;
        this.page = 0;
        this.listProfessionalHIs(this.form.get('id').value);
      }
    
      deleteProfessionalHI(id: string) {
        this.professionalService.deleteProfessionalHI(id).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Convênio excluido com sucesso!',
            });
            this.refresh();
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao exluir convênio',
            });
          }
        );
      }

      deleteTemporaryProfessionalHI(id: string) {
        let array: any = this.form.get('health_insurances').value;
        const hi = array.find(ex => ex.health_insurance_id === id);
        const index = array.indexOf(hi);
        array.splice(index, 1);
      }
}
