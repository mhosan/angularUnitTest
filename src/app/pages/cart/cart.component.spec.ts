import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CartComponent } from "./cart.component";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { BookService } from "../../services/book.service";
import { Book } from "src/app/models/book.model";

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


describe('Cart Component', ()=>{
    let component: CartComponent;                   //Agrego componente a testear
    let fixture: ComponentFixture<CartComponent>;   //fixture obtiene contenido del componente x ej un servicio que
                                                    //se usa en el componente a testear.
    let service: BookService;                       //Declarar el servicio aqui para que esté disponible para todos los test
    
    //=======================================================================================================
    //Primer beforEach(). Para crear eventos dentro del test se usa beforEach(). Es parecido a un ngOnInit().
    //El beforeEach() se ejecutará antes de cada test. 
    //=======================================================================================================
    beforeEach(()=> {                               
        TestBed.configureTestingModule({
            imports: [ 
                HttpClientTestingModule             //HttpClientTestingModule, a diferencia de HttpClientModule, no
            ],                                      //ejecuta realmente los request, los mockea.
                                                    
            declarations:[                          //el componente que vamos a testear
                CartComponent
            ],           
            providers:[                             //servicios
                BookService
            ],                
            schemas:[
                CUSTOM_ELEMENTS_SCHEMA,             //Se aconseja agregar "schemas" con esas dos constantes
                NO_ERRORS_SCHEMA
            ]                  
        }).compileComponents();
    });

    //===========================================================================================================
    //Luego del anterior beforeEach(), se hace otro para instanciar el componente a testear. Se utiliza "fixture"
    //para instanciar. Esto se podría haber puesto en el primer beforeEach() pero de esta forma queda el código
    //mas limpio.
    //===========================================================================================================
    beforeEach(()=>{
        fixture=TestBed.createComponent(CartComponent);
        component=fixture.componentInstance;
        fixture.detectChanges();
        service = fixture.debugElement.injector.get(BookService); 
        spyOn(service, 'getBooksFromCart').and.callFake(() => listBook);//esto se pone porque en el ngOnInit llama al
                                                    //servicio, para mockearlo. 
    });

    //===============================================================================================================
    //En un test se espera que ocurra algo. En este caso, se espera a que el componente sea instanciado correctamente
    //===============================================================================================================
    it('Should create',()=>{                        
        expect(component).toBeTruthy();
    });


    //=========================================
    //Este test es a un método que tiene return
    //=========================================
    it('getTotalPrice method return an amount', ()=>{
        const totalPrice = component.getTotalPrice(listBook);
        expect(totalPrice).toBeGreaterThan(0);
        expect(totalPrice).not.toBeNull();
    });

    //============================================
    //Este test es a un método que no tiene return
    //============================================
    it('onInputNumberChange increments correctly', ()=>{
        const action = 'plus';
        //const book = listBook[0];                 //Ojo!, leyendo del array inicial da error, ya que los test
                                                    //NO se ejecutan en orden!, por lo tanto cuando llega aqui el
                                                    //valor puede estar cambiado!.
        const book = {
            name: '',
            author: '',
            isbn: '',
            price: 15,
            amount: 2
        };
    
                                                    //Hay que acceder al servicio. El problema es que es privado:
        //const service1 = (component as any)._bookService;//Forma erronea. Si bien funciona, se pierden los tipos.
        //const service2 = component["_bookService"]; //Otra forma erronea, aunque se conservan los tipos. Aqui se 
                                                    //podría poner cualquier cosa entre corchetes y se admite(?)
        //const service = fixture.debugElement.injector.get(BookService);//forma correcta. Tambien se podria declarar
                                                    //como global, al principio del describe, para usarlo varias veces
                                                    //e instanciarlo en el segundo beforeEach.
                                                        
        const spy1 = spyOn(service, 'updateAmountBook').and.callFake(()=> null);//Este spy mira en el servicio, el 
                                                    //el método updateAmountBook, pero para no llamar realmente al
                                                    //servicio, se le mockea la respuesta con null, ya que de todas
                                                    //formas, en el expect solamente se prueba que sea llamado.
        const spy2 = spyOn(component, 'getTotalPrice').and.callFake(()=> null);//Idem spy1.

        expect(book.amount).toBe(2);                //valor inicial.
        
        component.onInputNumberChange(action, book);//Ahora hay que llamar al método que a su vez invoca el servicio

        //expect(book.amount).toBe(3);        
        expect(book.amount === 3).toBeTrue();       //valor luego de llamar al metodo.

        expect(spy1).toHaveBeenCalled();            //Ojo que en el método del componente, en la clase, se llama a getTotalPrice
                                                    //con el resultado de este metodo como parámetro y da error. Armar
                                                    //otro spy para ese segundo método.
                                                    //Pero en realidad no se debe llamar realmente al servicio, hay que mockearlo
                                                    //para que no haga esa llamada al servicio. Poner un callFake en el spy1
        expect(spy2).toHaveBeenCalled();
        
    });


    //=========================================================================
    //Este test es igual que el anterior, pero chequea la branch de decrementar
    //=========================================================================
    it('onInputNumberChange decrements correctly', ()=>{
        const action = 'minus';
        const book = {
            name: '',
            author: '',
            isbn: '',
            price: 15,
            amount: 3
        };

        const spy1 = spyOn(service, 'updateAmountBook').and.callFake(()=> null); 
        const spy2 = spyOn(component, 'getTotalPrice').and.callFake(()=> null);

        expect(book.amount).toBe(3);
        
        component.onInputNumberChange(action, book);
        
        expect(book.amount).toBe(2);

        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    //=================================================================================================
    //Ahora probar un método privado: Para esto llamar al método publico que consume al metodo privado.
    //=================================================================================================
    it('onClearBooks works correctly', () => {      //onClearBooks es el método público, que luego llama al
                                                    //método privado que se quiere testear.
        const spy1 = spyOn((component as any), '_clearListCartBook').and.callThrough();//Ojo, aca se usa callThrough
                                                    //en lugar de callFake, ya que ahora se quiere que este método
                                                    //se ejecute realmente, ya que se encuentra dentro de la clase que
                                                    //se está testeando.
        const spy2 = spyOn(service,'removeBooksFromCart').and.callFake(() => null);//este spy se agrega porque desde el
                                                    //método privado se llama a un servicio externo a la clase.
        component.listCartBook=listBook;
        component.onClearBooks();
        expect(component.listCartBook.length === 0).toBeTrue;
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    //==================================================================================================================
    //Tambien se podría probar directamente el método privado, pero la forma más correcta es la anterior. Para este caso
    //se usa la notación de array en el componente y asi acceder al método privado:
    //==================================================================================================================
    it('_clearListCartBook works correctly', () => {
        const service = fixture.debugElement.injector.get(BookService)
        const spy1 = spyOn(service,'removeBooksFromCart').and.callFake(() => null);
        component.listCartBook = listBook;
        component["_clearListCartBook"]();
        expect(component.listCartBook.length).toBe(0);
        expect(spy1).toHaveBeenCalled();
    });

    //====================================
    //Testear subscripciones a observables
    //====================================

})