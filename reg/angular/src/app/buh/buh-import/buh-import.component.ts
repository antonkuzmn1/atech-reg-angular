import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { BuhImportParserParams } from './buh-import-parser-params';

@Component({
  selector: 'app-buh-import',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    FormsModule,
  ],
  templateUrl: './buh-import.component.html',
  styleUrl: './buh-import.component.scss'
})
export class BuhImportComponent implements OnInit {

  ngOnInit(): void {
    console.log('success')
  }

  file!: File;
  jsonData: any[] = [];
  firstAndLastRows: { index: number, row: any }[] = [];
  test: string = 'test';
  pp = new BuhImportParserParams();

  onFileChange(event: any) {
    this.file = event.target.files[0];
    this.convertToJSON();
  }

  convertToJSON() {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (e.target !== null) {
          const data = new Uint8Array(e.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          // console.log(sheet);
          this.jsonData = [];
          for (let i = parseInt(this.pp.start); i !== parseInt(this.pp.stop) + 1; i++) {
            const getValueOfCell = function (letter: string): string | number {
              try {
                const value = sheet[letter + i].v;
                if (value === undefined) return '';
                else return sheet[letter + i].v;
              } catch (e) { throw new Error('o kurwa') }
            };
            const cellToDate = function (inputDate: string): Date {
              try {
                const dateString: string | number = getValueOfCell(inputDate);
                if (typeof dateString !== 'string'
                  || dateString === '') throw new Error('o kurwa');
                const DMY: string[] = dateString.split('.');
                const day: string = DMY[0];
                const mon: string = DMY[1];
                const yer: string = DMY[2];
                const formattedDateString: string = `${yer}-${mon}-${day}`;
                return new Date(formattedDateString);
              } catch (e) { throw new Error('o kurwa') }
            };
            try {
              const inputDate: Date = cellToDate(this.pp.inputDate);
              const contrAgent: string | number = getValueOfCell(this.pp.contrAgent);
              const paymentDestination: string | number = getValueOfCell(this.pp.paymentDestination);
              const initiatorOfPayment: string | number = getValueOfCell(this.pp.initiatorOfPayment);
              const sum: string | number = getValueOfCell(this.pp.sum);
              if (!(inputDate instanceof Date)) throw new Error();
              if (typeof contrAgent !== 'string') throw new Error();
              if (typeof paymentDestination !== 'string') throw new Error();
              if (typeof initiatorOfPayment !== 'string') {
                console.log(initiatorOfPayment);
                throw new Error()
              };
              if (typeof sum !== 'number') throw new Error();
              interface Row {
                inputDate: Date,
                contrAgent: string,
                paymentDestination: string,
                initiatorOfPayment: string,
                sum: number,
              }
              const row: Row = {
                inputDate: inputDate,
                contrAgent: contrAgent,
                paymentDestination: paymentDestination,
                initiatorOfPayment: initiatorOfPayment,
                sum: sum,
              };
              this.jsonData.push(row);
            } catch (e) { throw new Error('o kurwa') }
          }
          this.firstAndLastRows = [];
          for (let i = 0; i !== 5; i++)
            this.firstAndLastRows.push({
              index: i + parseInt(this.pp.start),
              row: this.jsonData[i],
            });
          for (let i = this.jsonData.length - 5; i !== this.jsonData.length; i++)
            this.firstAndLastRows.push({
              index: i + parseInt(this.pp.start),
              row: this.jsonData[i],
            });
          console.log(this.jsonData);
        }
      } catch (e) {
        this.jsonData = [];
        this.firstAndLastRows = [];
      }
    };
    reader.readAsArrayBuffer(this.file);
  }

  months: string[] = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  dateToString(date: Date) {
    const day = date.getDate();
    const month = this.months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year} г.`;
  }

}
