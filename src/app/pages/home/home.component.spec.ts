import { BookService } from './../../services/book.service';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HomeComponent } from "./home.component";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Book } from 'src/app/models/book.model';
import { of } from 'rxjs';

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

const bookServiceMocked = {                         //Este objeto reemplazará al servicio original.
    getBooks: ()=> of(listBook),
}

describe('Home component', ()=>{
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(()=>{
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            declarations: [
                HomeComponent
            ],
            providers:[
                //BookService,
                {
                    provide: BookService,           //Aqui se usa un objeto que reemplaza al servicio original. Este objeto seria
                                                    //el servicio completo mockeado, con todos sus métodos.
                    useValue: bookServiceMocked
                }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();
    });
    beforeEach(()=>{
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();   
    });

    it('should create', ()=>{
        expect(component).toBeTruthy();
    });

    //===============================================================================
    //Testear un observable mockeando UN metodo del servicio que se usa en el método.
    //===============================================================================
    it('getBooks get books from the subscription',()=>{
        const bookService = fixture.debugElement.injector.get(BookService);
        const listBook: Book[] = [];                //se pasa un array vacio, pero tambien se podria pasar una const local con
                                                    //el array con datos.
        const spy1 = spyOn(bookService, 'getBooks').and.returnValue(of(listBook));//Se utiliza el operador "of" de la libreria
                                                    //RxJs para transformar en observable el argumento listBook
        component.getBooks();
        expect(spy1).toHaveBeenCalled();
        expect(component.listBook.length).toBe(0);
    });
 
    //===================================================================================
    //Testear un observable mockeando el servicio completo y no solo un método del mismo.
    //Aqui se está repitiendo el test anterior con fines didácticos.
    //===================================================================================
    it('getBooks (with the service mocked) get books from the subscription',()=>{
        const bookService = fixture.debugElement.injector.get(BookService);
        component.getBooks();
        expect(component.listBook.length).toBe(3);
    });

});

