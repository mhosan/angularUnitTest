import { BookService } from './../../services/book.service';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HomeComponent } from "./home.component";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Book } from 'src/app/models/book.model';
import { of } from 'rxjs';


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
                BookService
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

});

