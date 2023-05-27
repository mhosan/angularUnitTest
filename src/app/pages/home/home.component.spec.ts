import { BookService } from './../../services/book.service';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HomeComponent } from "./home.component";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { HttpClientTestingModule } from "@angular/common/http/testing";


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
});

