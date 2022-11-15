import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, catchError, finalize, map, Observable, of } from 'rxjs';
import { CustonTable } from 'src/app/interfaces/CustonTable';
import { Pacote } from 'src/app/model/Pacote';
import { Filtro } from 'src/app/pages/encomendas/Filtro';
import { PacoteService } from 'src/app/service/pacote.service';

export class ControladorTabela extends DataSource<CustonTable> {

	private pacotesSubject = new BehaviorSubject<CustonTable[]>([]);
	private carregandoPacoteSubject = new BehaviorSubject<Boolean>(false);

	public carregango$ = this.carregandoPacoteSubject.asObservable();

	public todosSeleciondos: Boolean = false
	public algunsSelecionados: Boolean = false

	constructor(private pacoteService: PacoteService){
		super()
	}

	connect(collectionViewer: CollectionViewer): Observable<CustonTable[]> {
		return this.pacotesSubject.asObservable()
		/*return this.pacoteService.getTodos().pipe(map((pacotes: Pacote[]) => {
			return pacotes.map((pacote: Pacote) => {
				let p: CustonTable = {
					pacote: pacote,
					select: false
				}
				return p
			})  
		}))*/
	}

	disconnect(collectionViewer: CollectionViewer): void {
		this.pacotesSubject.complete();
		this.carregandoPacoteSubject.complete();
	}

	buscaTodos(){
		this.carregandoPacoteSubject.next(true);

		this.pacoteService.getTodos().pipe(map((pacotes: Pacote[]) => {
			return pacotes.map((pacote: Pacote) => {
				let p: CustonTable = {
					pacote: pacote,
					select: false
				}
				return p
			})  
		}),
			catchError(()=> of([])),
			finalize(() => this.carregandoPacoteSubject.next(false))
		).subscribe(p => this.pacotesSubject.next(p))
	}

	buscaCustom(filtros: Filtro[]){
		console.log("Filtros: ")
		console.log(filtros)
	}

	idPacotesSelecionados(): String[]{
		let linhas: String[] = []

		this.pacotesSubject.asObservable().forEach((custonTable: CustonTable[]) => {
			custonTable.map((ct: CustonTable) => {
				if(ct.select) linhas.push(ct.pacote.id)
			})
		})
		return linhas
	}

	checkboxLinhaClicado(linha: any){
		linha.select = !linha.select
		
		let count = 0, total = 0
		this.pacotesSubject.asObservable().forEach((custonTable: CustonTable[]) => {
			custonTable.map((ct: CustonTable) => {
				total++
				if(ct.select) count++
			})
		})

		if(count == 0){
			this.todosSeleciondos = false
			this.algunsSelecionados = false

		} else if((total > 0) && (count == total)){
			this.todosSeleciondos = true
			this.algunsSelecionados = false

		} else{
			this.todosSeleciondos = false
			this.algunsSelecionados = true
		}
	}

	checkboxTodosClicado(state: boolean){
		this.todosSeleciondos = state

		this.pacotesSubject.asObservable().subscribe((custonTable: CustonTable[]) => {
			custonTable.forEach(((ct: CustonTable) => {
				ct.select = this.todosSeleciondos
			}))
		})
	}
}