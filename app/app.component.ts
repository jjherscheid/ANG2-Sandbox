import { Component, OnInit } from '@angular/core';
import { CompositeSpecification, ISpecification} from './specifications';

@Component({
  selector: 'my-app',
  templateUrl: 'app/app.component.html'
})
export class AppComponent implements OnInit {
  persons: Person[] = [];

  private femaleSpec = new GenderSpecification(Gender.Female);
  private matureSpec = new IsMatureSpecification();

  ngOnInit() {
    this.persons.push(new Person('Mike', 34, Gender.Male));
    this.persons.push(new Person('Perry', 8, Gender.Male));
    this.persons.push(new Person('Gregory', 6, Gender.Male));
    this.persons.push(new Person('Rachel', 3, Gender.Female));
    this.persons.push(new Person('Betty', 35, Gender.Female));
  }

  private executeSpecification(spec: ISpecification<Person>) {
    let filteredList: Person[] = [];
    this.persons.forEach(person => {
      if (spec.IsSatisfiedBy(person)) {
        filteredList.push(person);
      }
    });
    return filteredList;
  }

  /// Returns all females
  get females() {
    return this.executeSpecification(this.femaleSpec);
  }

  get matureFemales() {
    let matureFemales = this.femaleSpec.and(this.matureSpec);
    return this.executeSpecification(matureFemales);
  }

  get matureOrFemales() {
    let matureFemales = this.femaleSpec.or(this.matureSpec);
    return this.executeSpecification(matureFemales);
  }

  get immatureOrFemales() {
    let matureFemales = this.femaleSpec.or(this.matureSpec.not());
    return this.executeSpecification(matureFemales);
  }
}

export class IsMatureSpecification extends CompositeSpecification<Person>{
  IsSatisfiedBy(candidate: Person): boolean {
    return candidate.age > 18;
  }
}

export class GenderSpecification extends CompositeSpecification<Person>{
  constructor(private gender: Gender) { super(); }

  IsSatisfiedBy(candidate: Person): boolean {
    return candidate.gender == this.gender;
  }
}

enum Gender {
  Male,
  Female
}

class Person {
  constructor(
    public name: string,
    public age: number,
    public gender: Gender) {
  }
}