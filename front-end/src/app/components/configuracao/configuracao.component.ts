import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Configuracao } from 'src/app/model/Configuracao';
import { ConfiguracaoService } from 'src/app/service/configuracao.service';

@Component({
  selector: 'app-configuracao',
  templateUrl: './configuracao.component.html',
  styleUrls: ['./configuracao.component.css']
})
export class ConfiguracaoComponent implements OnInit {

  formConfig: FormGroup

  labelIntervaloAtualizacao;

  constructor(private fb: FormBuilder, private dialog: MatDialogRef <ConfiguracaoComponent>){
    this.formConfig = this.createForm(this.fb)
    dialog.disableClose = true;
    this.labelIntervaloAtualizacao = this.formConfig.controls['intervaloAtualizacao'].value
  }

  ngOnInit(): void {
  }
  
  createForm(fb: FormBuilder){
    return fb.group({
      atualizacaoAutomatica: [false],
      horarioComercialAtualizacao: [false],
      tipoOrdenacaoPadrao: [1],
      intervaloAtualizacao: [2]
    })
  }

  updateLabelAtualizacaoAutomatica(event: any){
    this.labelIntervaloAtualizacao = event.value
  }

  save(){
    let configuracao = new Configuracao()
    configuracao.atualizacaoAutomatica = this.formConfig.controls['atualizacaoAutomatica'].value
    configuracao.horarioComercialAtualizacao = this.formConfig.controls['horarioComercialAtualizacao'].value
    configuracao.intervaloAtualizacao = this.formConfig.controls['intervaloAtualizacao'].value
    configuracao.tipoOrdenacaoPadrao = this.formConfig.controls['tipoOrdenacaoPadrao'].value

    new ConfiguracaoService().salvar(configuracao)
  }

  closeDialog(){
    this.dialog.close()
  }
}
