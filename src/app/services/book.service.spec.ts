import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { BookService } from "./book.service";
import { TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/compiler";
import { Book } from "../models/book.model";
import { environment } from "src/environments/environment";

const listBook:Book[] = [
    {
        name: '',
        author: '',
        isbn: '',
        price: 15,
        amount: 2
    },
    {
        name: '',
        author: '',
        isbn: '',
        price: 10,
        amount: 3
    },
    {
        name: '',
        author: '',
        isbn: '',
        price: 20,
        amount: 5
    }
];


describe('book service', ()=>{
    let service: BookService;
    let httpMock: HttpTestingController;
    
    beforeEach(()=>{
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                BookService
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        });  
    });
    beforeEach(()=>{
        service = TestBed.inject(BookService);
        httpMock = TestBed.inject(HttpTestingController);     
    });

    afterEach(()=>{
        httpMock.verify();                          //Esto verifica que no existan peticiones pendientes antes de hacer una nueva.
    });

    it('should be created', ()=>{
        expect(service).toBeTruthy();
    });

    //======================================
    //Probar el método getBook del servicio:
    //======================================
    it('getBook method return a listo of book and does a get method', ()=>{
        service.getBooks().subscribe((resp: Book[])=>{
            expect(resp).toEqual(listBook);
        });

        const req = httpMock.expectOne(environment.API_REST_URL + '/book');
        expect(req.request.method).toBe('GET');
        req.flush(listBook);                        //este flush hace disparar la subscripcion de service.getBooks()
    });

});